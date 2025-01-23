package routes

import(
	"Parking/controllers"
	"github.com/gin-gonic/gin"
)

//перечисляем пути
func ParkingRoutes(incomingRoutes *gin.Engine){
	incomingRoutes.GET("/parking/session", controllers.GetParkingSession()) //получение парковочной сессии - GET запрос по адресу /parking/session. обрабатывает функция GetParkingSession()
	incomingRoutes.POST("/parking/new", controllers.NewParkingSession()) //начало парковочной сессии - POST запрос по адресу /parking/new. обрабатывает функция NewParkingSession()
	incomingRoutes.DELETE("/parking/session/end", controllers.EndParkingSession()) //окончание парковочной сессии - DELETE запрос по адресу /parking/session/end. обрабатывает функция EndParkingSession()
}