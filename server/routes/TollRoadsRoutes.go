package routes

import(
	"Parking/controllers"
	"github.com/gin-gonic/gin"
)

func TollRoadsRoutes(incomingRoutes *gin.Engine){
	incomingRoutes.GET("/tollroads", controllers.GetTollRoads())
	incomingRoutes.POST("/tollroads/pay", controllers.PayForTollRoad())
}