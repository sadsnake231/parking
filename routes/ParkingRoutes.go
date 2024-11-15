package routes

import(
	"Parking/controllers"
	"github.com/gin-gonic/gin"
)

func ParkingRoutes(incomingRoutes *gin.Engine){
	incomingRoutes.GET("/parking/session", controllers.GetParkingSession())
	incomingRoutes.POST("/parking/new", controllers.NewParkingSession())
	incomingRoutes.DELETE("/parking/session/end", controllers.EndParkingSession())
}