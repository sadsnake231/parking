package main

import(
	"Parking/routes"
	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.New()
	router.Use(gin.Logger())
	
	routes.UserRoutes(router)
	routes.TroikaRoutes(router)
	routes.FineRoutes(router)
	routes.BenefitRoutes(router)
	routes.ParkingRoutes(router)

	router.Run(":3000")
}