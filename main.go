package main

import(
	"Parking/routes"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {

	router := gin.New()
	router.Use(gin.Logger())
	
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Указываем фронтенд-домен
		AllowMethods:     []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true, // Разрешаем отправку credentials (cookies)
	}))


	routes.UserRoutes(router)
	routes.TroikaRoutes(router)
	routes.FineRoutes(router)
	routes.BenefitRoutes(router)
	routes.ParkingRoutes(router)
	routes.TollRoadsRoutes(router)

	router.Run(":5000")
}