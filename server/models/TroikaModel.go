package models

type Troika struct{
	Id 					string		`json:"id"`
	Balance 			*int  		`json:"balance"`
	Number 				*string		`json:"number"`
	ValidityPeriod 		*string		`json:"validity"`
	UserId				string		`json:"userid"`
}