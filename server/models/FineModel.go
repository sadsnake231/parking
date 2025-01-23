package models

type Fine struct{
	Id 				string
	UIN 			*string		`json:"uin"`
	DateTime 		*string		`json:"datetime"`
	Status 			bool		`json:"status"`
	Sum				*string		`json:"sum"`
	UserId			*string		`json:"userId`
}

