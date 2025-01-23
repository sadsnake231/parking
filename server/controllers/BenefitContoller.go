package controllers

import(
	"Parking/helpers"
	"Parking/models"
	"github.com/gin-gonic/gin"

	"context"
	"time"
	"net/http"
	"strconv"
	"math/rand"
)

func NewBenefit() gin.HandlerFunc {
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

		var benefit models.Benefit

		if err := c.BindJSON(&benefit); err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		rand.Seed(time.Now().UnixNano())
		randomNumber := rand.Intn(1_000_000_0000) + 1_000_000_0000 
		randomNumberS := strconv.Itoa(randomNumber)
		benefit.Number = &randomNumberS

		date := time.Now().AddDate(1, 0, 0).Format(time.RFC3339)
		benefit.ValidityPeriod = &date
		benefit.UserId = &id

		err = helpers.NewBenefit(conn, ctx, benefit)
		if err != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "new benefit done"})
	}
}

func GetBenefits() gin.HandlerFunc {
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

		benefits, err1 := helpers.GetBenefits(conn, ctx, id)
		if err1 != nil{
			c.JSON(http.StatusInternalServerError, gin.H{"error": err1.Error()})
			return
		}

		c.JSON(http.StatusOK, benefits)
	}
}