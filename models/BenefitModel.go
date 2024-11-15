package models

type Benefit struct{
	Id 				string		`json:"id"`
	District 		*string		`json:"district"`
	Number			*string 	`json:"number"`
	ValidityPeriod	*string		`json:"validity"`
	UserId			*string		`json:"userid"`
}