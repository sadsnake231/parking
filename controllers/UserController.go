package controllers

import(
	"Parking/database"
	"Parking/helpers"
	"Parking/models"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/golang-jwt/jwt"

	"context"
	"time"
	"net/http"
	"log"
)

var conn *pgxpool.Pool = database.ConnectToDb()
var SecretKey = "TOPSECRET"

func SignUp() gin.HandlerFunc {
	return func (c *gin.Context){
		var ctx, cancel = context.WithTimeout(context.Background(), 100 * time.Second)
		var user models.User

		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		//поиск емейлов и телефонов
		count1, err1 := helpers.CountUsersByEmail(conn, ctx, user.Email)
		count2, err2 := helpers.CountUsersByPhoneNumber(conn, ctx, user.PhoneNumber)
		if err1 != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occured while checking for the email"})
			log.Panic(err1)
		}

		if err2 != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occured while checking for the phone number"})
			log.Panic(err2)
		}
		
		if count1 > 0 || count2 > 0{
			c.JSON(http.StatusBadRequest, gin.H{"error": "phone number or email already exists"})
			return
		}

		
		//хеширование пароля
		password := helpers.HashPassword(*user.Password)
		user.Password = &password
		
		//вставляем в БД нового пользователя

		if err := helpers.RegisterUser(conn, ctx, user.Name, user.Password, user.PhoneNumber, user.Car, user.Email, user.STS); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		defer cancel()
		c.JSON(http.StatusCreated, gin.H{"message": "done"})
	}
}

func Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var user models.User

		// Декодируем тело запроса в user
		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Проверяем, что phoneNumber и password не пустые, иначе возвращаем ошибку
		if user.PhoneNumber == nil || user.Password == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "phone number and password are required"})
			return
		}

		// Ищем пользователя по номеру телефона
		foundUserPtr, err := helpers.FindUser(conn, ctx, user.PhoneNumber)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error finding user: " + err.Error()})
			return
		}

		// Проверка, если пользователь не найден
		if foundUserPtr == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}

		// Копируем данные найденного пользователя
		foundUser := *foundUserPtr

		// Проверка пароля
		passwordIsValid, msg := helpers.VerifyPassword(*foundUser.Password, *user.Password)
		if !passwordIsValid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			return
		}


		//генерация токена и куки
		claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
			Issuer: *foundUser.Id,
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
		})

		token, err := claims.SignedString([]byte(SecretKey))

		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}

		c.SetCookie(
			"jwt",
			token,
			86400,
			"/",
			"localhost",
			false,
			true,
		)
		// Возвращаем ID пользователя
		c.JSON(http.StatusOK, gin.H{"user_id": foundUser.Id})
	}
}

func CheckCookie() gin.HandlerFunc {
	return func(c *gin.Context){
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var id string
		cookie, err := c.Cookie("jwt")
		id, err = helpers.CookieCheck(ctx, cookie, err, SecretKey)
		if err != nil{
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		c.JSON(http.StatusOK, id)
	}
}