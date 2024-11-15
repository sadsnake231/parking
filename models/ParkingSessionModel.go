package models

type ParkingSession struct{
	Id 			string
	StartTime 	*string
	UserId		*string
	ParkovkaId	*string		`json:"pid"`
}

type ParkingSessionAndBenefits struct{
	Session 	ParkingSession
	Benefits	[]Benefit
	Parking		Parking
}

type Parking struct{
	District 	string
	Cost		string
}