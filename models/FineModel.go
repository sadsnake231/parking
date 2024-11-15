package models

type Fine struct{
	Id 				string
	UIN 			*string		`json:"uin"`
	DateTime 		*string
	Status 			bool
	Sum				*string		`json:"sum"`
	UserId			*string		`json:"userId`
}

