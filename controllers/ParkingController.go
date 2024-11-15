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

		var id string
		cookie, err := c.Cookie("jwt")
		id, err = helpers.CookieCheck(ctx, cookie, err, SecretKey)
		if err != nil{
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		parkingSessionAndBenefits, err := helpers.GetParkingSessionAndBenefits(conn, ctx, id)
		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, parkingSessionAndBenefits)
	}
}

func NewParkingSession() gin.HandlerFunc {
	return func (c *gin.Context){
		var ctx, cancel = context.WithTimeout(context.Background(), 100 * time.Second)
		defer cancel()

		var id string
		cookie, err := c.Cookie("jwt")
		id, err = helpers.CookieCheck(ctx, cookie, err, SecretKey)
		if err != nil{
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		

		var requestData struct{
			District string `json:"district"`
		}
		var parkingSession models.ParkingSession

		if err := c.BindJSON(&requestData); err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error":err.Error(), "message": "err1"})
		}

		parkingSession.ParkovkaId, err = helpers.GetParkingByDistrict(conn, ctx, requestData.District)
		if err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": requestData.District})
			return
		}

		availableSeats, err := helpers.GetNumberOfSeats(conn, ctx, *parkingSession.ParkovkaId)
		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": "err3"})
			return
		}

		if availableSeats <= 0{
			c.JSON(http.StatusBadRequest, gin.H{"message": "no seats available"})
			return
		}

		parkingSession.UserId = &id
		startTime := time.Now().Format(time.RFC3339)
		parkingSession.StartTime = &startTime

		err = helpers.NewParkingSession(conn, ctx, parkingSession)
		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": "err4"})
			return
		}

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

		var requestData struct{
			PId 	string 		`json:pid`
			BId 	*string 	`json:bid`
		}
		var cost float64
	

		//получили id сессии и льготы
		if err := c.BindJSON(&requestData); err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
		}
		
		
		cost, err = helpers.GetCostOfSession(conn, ctx, requestData.PId)
		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "msg":"2"})
			return
		} 

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