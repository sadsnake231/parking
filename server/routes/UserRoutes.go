package routes

import(
	"Parking/controllers"
	"github.com/gin-gonic/gin"
)
func UserRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.POST("/signup", controllers.SignUp())
	incomingRoutes.POST("/login", controllers.Login())
	incomingRoutes.GET("/check", controllers.CheckCookie())
}