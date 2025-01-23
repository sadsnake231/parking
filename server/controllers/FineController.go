package controllers

import(
	"Parking/helpers"
	"Parking/models"
	"github.com/gin-gonic/gin"

	"context"
	"time"
	"net/http"
)


func GetFines() gin.HandlerFunc {
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

		fines, err1 := helpers.GetFines(conn, ctx, id)
		if err1 != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err1.Error()})
			return
		}

		c.JSON(http.StatusOK, fines)
	}
}

func PayFine() gin.HandlerFunc {
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
			UIN 	string		`json:"uin"`
		}

		if err := c.BindJSON(&requestData); err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := helpers.PayFine(conn, ctx, id, requestData.UIN); err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldnt pay a fine"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Fine payed successfully"})
	}
}

func NewFine() gin.HandlerFunc {
	return func (c *gin.Context){
		var ctx, cancel = context.WithTimeout(context.Background(), 100 * time.Second)
		defer cancel()

		var fine models.Fine

		if err := c.BindJSON(&fine); err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		count, err1 := helpers.CountFinesByUIN(conn, ctx, *fine.UIN)
		if err1 != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occured while checking for uin"})
			return
		}

		if count > 0{
			c.JSON(http.StatusBadRequest, gin.H{"error": "fine with this uin already exists"})
			return
		}
		
		date := time.Now().Format(time.RFC3339)
		fine.DateTime = &date
		fine.Status = false 

		if err := helpers.NewFine(conn, ctx, fine); err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "done"})
	}


}