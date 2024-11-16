package models

type ParkingSession struct{
	Id 			string		`json:sessionid`
	StartTime 	*string		`json:"starttime"`
	UserId		*string
	ParkovkaId	*string
}

type ParkingSessionAndBenefits struct{
	Session 	ParkingSession	`json:"parkingsession"`
	Benefits	[]Benefit		`json:"benefits"`
	Parking		Parking			`json:"parking"`
}

type Parking struct{
	District 	string			`json:"district"`
	Cost		string			`json:"cost`
}