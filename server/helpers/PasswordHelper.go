package helpers

import(
	"golang.org/x/crypto/bcrypt"
	"fmt"
	"log"
)

func HashPassword(password string) string{
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil{
		log.Panic(err)
	}
	return string(bytes)
}

func VerifyPassword(userPassword string, providedPassword string) (bool, string){
	err := bcrypt.CompareHashAndPassword([]byte(userPassword), []byte(providedPassword))
	flag := true
	msg := "Access granted"

	if err != nil{
		msg = fmt.Sprintf("Email or password is incorrect")
		flag = false
	}
	return flag, msg
}