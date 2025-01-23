package models


type TollRoad struct {
	Type   string    `json:"type"`   // Тип дороги ("MCD" или "Bagration")
	ID     int       `json:"id"`     // ID записи
	Status bool      `json:"status"` // Статус оплаты
	Date   string 	 `json:"date"`   // Дата проезда
	UIN    string    `json:"uin"`    // Уникальный идентификатор
}