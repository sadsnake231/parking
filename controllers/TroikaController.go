package controllers

import(
	"Parking/helpers"
	"Parking/models"
	"github.com/gin-gonic/gin"

	"context"
	"time"
	"net/http"
	"math/rand"
)


func GetTroikas() gin.HandlerFunc {
	return func(c *gin.Context){
		var ctx, cancel = context.WithTimeout(context.Background(), 100 * time.Second)
		defer cancel()

		var id string
		cookie, err := c.Cookie("jwt")
		id, err = helpers.CookieCheck(ctx, cookie, err, SecretKey)
		if err != nil{
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		cards, err1 := helpers.GetTroikas(conn, ctx, id)
		if err1 != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err1.Error()})
			return
		}

		c.JSON(http.StatusOK, cards)
		
	}
}

func NewTroika() gin.HandlerFunc {
	return func(c *gin.Context){
		var ctx, cancel = context.WithTimeout(context.Background(), 100 * time.Second)
		defer cancel()

		var id string
		cookie, err := c.Cookie("jwt")
		id, err = helpers.CookieCheck(ctx, cookie, err, SecretKey)
		if err != nil{
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		var troika models.Troika

		if err := c.BindJSON(&troika); err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		balance := rand.Intn(5000)
		troika.Balance = &balance
		validityPeriod := time.Now().AddDate(0, rand.Intn(36) + 1, 0).Format("2006-02-01")
		troika.ValidityPeriod = &validityPeriod
		troika.UserId = id

		if err := helpers.NewTroika(conn, ctx, troika); err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"msg": "couldnt put troika", "error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "done"})

	}
}

func PutMoney() gin.HandlerFunc {
	return func(c *gin.Context){
		var ctx, cancel = context.WithTimeout(context.Background(), 100 * time.Second)
		defer cancel()
		
		var requestData struct{
			Number 	string 	`json:"number"`
			Sum		int		`json:"sum`
		}

		if err := c.BindJSON(&requestData); err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := helpers.IncreaseTroikaBalance(conn, ctx, requestData.Number, requestData.Sum); err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		c.JSON(http.StatusOK, gin.H{"message": "balance updated"})
	}
}
