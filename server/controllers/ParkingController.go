package controllers

import(
	"Parking/helpers"
	"Parking/models"
	"github.com/gin-gonic/gin"

	"context"
	"time"
	"net/http"
)

func GetParkingSession() gin.HandlerFunc {
	return func (c *gin.Context){
		var ctx, cancel = context.WithTimeout(context.Background(), 100 * time.Second)
		defer cancel()

		//получение id пользователя через куки
		var id string
		cookie, err := c.Cookie("jwt")
		id, err = helpers.CookieCheck(ctx, cookie, err, SecretKey)
		//если ошибка то пользователь не авторизован, возвращаем статус 401
		if err != nil{
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		
		//получаем parkingSessionAndBenefits (состоит из парковочной сессии и массива льгот) и ошибку
		parkingSessionAndBenefits, err := helpers.GetParkingSessionAndBenefits(conn, ctx, id)
		//если ошибка не равна нулю, то возвращаем статус 500 и текст ошибки
		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		//если все хорошо, то возвращаем статус 200 и 
		c.JSON(http.StatusOK, parkingSessionAndBenefits)
	}
}

func NewParkingSession() gin.HandlerFunc {
	return func (c *gin.Context){
		var ctx, cancel = context.WithTimeout(context.Background(), 100 * time.Second)
		defer cancel()
		
		//работа с куки
		var id string
		cookie, err := c.Cookie("jwt")
		id, err = helpers.CookieCheck(ctx, cookie, err, SecretKey)
		if err != nil{
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		
		//структура для получения района сессии
		var requestData struct{
			District string `json:"district"`
		}
		var parkingSession models.ParkingSession

		//пытаемся получить структуру, если ошибка, то возвращаем статус 400
		if err := c.BindJSON(&requestData); err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error":err.Error(), "message": "err1"})
		}

		//получаем парковку по району
		parkingSession.ParkovkaId, err = helpers.GetParkingByDistrict(conn, ctx, requestData.District)
		if err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": requestData.District})
			return
		}
		
		//проверяем количество свободных мест на парковке
		availableSeats, err := helpers.GetNumberOfSeats(conn, ctx, *parkingSession.ParkovkaId)
		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": "err3"})
			return
		}

		//если их 0, то возвращаем статус 401
		if availableSeats <= 0{
			c.JSON(http.StatusBadRequest, gin.H{"message": "no seats available"})
			return
		}

		//начинаем парковочную сессию
		parkingSession.UserId = &id
		startTime := time.Now().Format(time.RFC3339)
		parkingSession.StartTime = &startTime

		err = helpers.NewParkingSession(conn, ctx, parkingSession)
		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": "err4"})
			return
		}


		//если все хорошо, то возвращаем статус 201
		c.JSON(http.StatusCreated, gin.H{"message": "session started"})
	}
}

func EndParkingSession() gin.HandlerFunc {
	return func (c *gin.Context){
		var ctx, cancel = context.WithTimeout(context.Background(), 100 * time.Second)
		defer cancel()

		cookie, err := c.Cookie("jwt")
		_, err = helpers.CookieCheck(ctx, cookie, err, SecretKey)
		if err != nil{
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}


		//запрашиваем id парковочной сессии и льготы. id льготы может быть null
		var requestData struct{
			PId 	string 		`json:pid`
			BId 	*string 	`json:bid`
		}
		var cost float64
	

		//получили id сессии и льготы
		if err := c.BindJSON(&requestData); err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
		}
		
		//получаем стоимость парковочной сессии
		cost, err = helpers.GetCostOfSession(conn, ctx, requestData.PId)
		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "msg":"2"})
			return
		} 
		
		//пытаемся завершить сессию
		err = helpers.EndParkingSession(conn, ctx, requestData.PId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "msg":"1"})
			return
		}

		//если льгота есть
		if requestData.BId != nil{
			cost = 0
		}
		
		c.JSON(http.StatusOK, gin.H{"message": "parking session ended successfully", "cost": cost})
	}
}