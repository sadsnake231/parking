package main

import(
	"Parking/routes"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {

	router := gin.New() //новый роутер
	router.Use(gin.Logger())
	
	//разрешаем отправку cookies на фронтенд
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	//подключаем пути к роутеру
	routes.UserRoutes(router)
	routes.TroikaRoutes(router)
	routes.FineRoutes(router)
	routes.BenefitRoutes(router)
	routes.ParkingRoutes(router)
	routes.TollRoadsRoutes(router)

	//запуск сервера на 5000 порте
	router.Run(":5000")
}