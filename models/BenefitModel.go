package models

type Benefit struct{
	Id 				string
	District 		*string		`json:"district"`
	Number			*string
	ValidityPeriod	*string
	UserId			*string		
}