package routes

import(
	"Parking/controllers"
	"github.com/gin-gonic/gin"
)

func BenefitRoutes(incomingRoutes *gin.Engine){
	incomingRoutes.GET("/benefits", controllers.GetBenefits())
	incomingRoutes.POST("/benefits/new", controllers.NewBenefit())
}