package main

import(
	"Parking/routes"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(cors.Default())


	routes.UserRoutes(router)
	routes.TroikaRoutes(router)
	routes.FineRoutes(router)
	routes.BenefitRoutes(router)
	routes.ParkingRoutes(router)
	routes.TollRoadsRoutes(router)

	router.Run(":5000")
}