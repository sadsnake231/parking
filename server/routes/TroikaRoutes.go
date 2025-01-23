package routes

import(
	"Parking/controllers"
	"github.com/gin-gonic/gin"
)

func TroikaRoutes(incomingRoutes *gin.Engine){
	incomingRoutes.GET("/troika", controllers.GetTroikas())
	incomingRoutes.POST("/troika/new", controllers.NewTroika())
	incomingRoutes.POST("/troika/putmoney", controllers.PutMoney())
}