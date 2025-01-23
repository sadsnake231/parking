package models

type User struct{
	Id  			*string			`json:"id"`
	Name 			*string			`json:"name"`
	PhoneNumber 	*string			`json:"phone"`
	Password		*string			`json:"password"`
	Car				*string			`json:"car"`
	Email			*string			`json:"email"`
	STS				*string			`json:"sts"`
}