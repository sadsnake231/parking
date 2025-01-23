package routes

import(
	"Parking/controllers"
	"github.com/gin-gonic/gin"
)

func FineRoutes(incomingRoutes *gin.Engine){
	incomingRoutes.GET("/fines", controllers.GetFines())
	incomingRoutes.POST("/fines/pay", controllers.PayFine())
	incomingRoutes.POST("/debug/newfine", controllers.NewFine())
}