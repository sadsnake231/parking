package helpers

import(
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5"
	"Parking/models"
	"context"
	"strconv"
	"time"
)

//функции для работы с данными пользователя
func RegisterUser(conn *pgxpool.Pool, ctx context.Context, name, password, phoneNumber, car, email, STS *string) error{
	query := `
			INSERT INTO "Parkovki"."AppUser" ("Name", "Password", "Phone Number", "Car", "Email", "STS")
			VALUES ($1, $2, $3, $4, $5, $6)
		`

		_, error := conn.Exec(ctx, query, name, password, phoneNumber, car, email, STS)
		return error
}

func CountUsersByEmail(conn *pgxpool.Pool, ctx context.Context, email *string)(int, error){
	var count int
	query := `SELECT COUNT (*) FROM "Parkovki"."AppUser" WHERE "Email" = $1;`
	err := conn.QueryRow(ctx, query, email).Scan(&count)
	if err != nil{
		return 0, err
	}
	return count, nil
}

func CountUsersByPhoneNumber(conn *pgxpool.Pool, ctx context.Context, phoneNumber *string)(int, error){
	var count int
	query := `SELECT COUNT (*) FROM "Parkovki"."AppUser" WHERE "Phone Number" = $1;`
	err := conn.QueryRow(ctx, query, phoneNumber).Scan(&count)
	if err != nil{
		return 0, err
	}
	return count, nil
}

func FindUser(conn *pgxpool.Pool, ctx context.Context, phoneNumber *string) (*models.User, error) {
	var user models.User
	query := `
		SELECT "id", "Name", "Password", "Phone Number", "Email", "Car", "STS"
		FROM "Parkovki"."AppUser"
		WHERE "Phone Number" = $1
	`

	// Выполняем запрос и сохраняем результат в структуре user
	err := conn.QueryRow(ctx, query, phoneNumber).Scan(&user.Id, &user.Name, &user.Password, &user.PhoneNumber, &user.Email, &user.Car, &user.STS)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil // Возвращаем nil, если пользователя нет в БД
		}
		return nil, err // Возвращаем ошибку, если возникла другая ошибка
	}

	return &user, nil
}

//конец функций для работы с данными пользователя
// --------------------------------------------------------------
//функции для работы с данными карт Тройка

func NewTroika(conn *pgxpool.Pool, ctx context.Context, troika models.Troika) error{
	query := `
		INSERT INTO "Parkovki"."TroikaCard" ("Balance", "Number", "Validity Period", user_id)
		VALUES ($1, $2, $3, $4);
	`
	idInt, _ := strconv.Atoi(troika.UserId)
	_, err := conn.Exec(ctx, query, *troika.Balance, *troika.Number, *troika.ValidityPeriod, idInt)

	return err
}	

func GetTroikas(conn *pgxpool.Pool, ctx context.Context, userId string) ([]models.Troika, error){
	query := `SELECT id, "Balance", "Number", "Validity Period", user_id FROM "Parkovki"."TroikaCard" WHERE user_id = $1`
	rows, err := conn.Query(ctx, query, userId)
	if err != nil{
		return nil, err
	}

	defer rows.Close()

	var cards []models.Troika
	for rows.Next(){
		var card models.Troika
		if err := rows.Scan(&card.Id, &card.Balance, &card.Number, &card.ValidityPeriod, &card.UserId); err != nil{
			return nil, err
		}

		cards = append(cards, card)
	}

	if err := rows.Err(); err != nil{
		return nil, err
	}

	return cards, nil

}

func IncreaseTroikaBalance(conn *pgxpool.Pool, ctx context.Context, number string, money int) error {
	query := `UPDATE "Parkovki"."TroikaCard" SET "Balance" = "Balance" + $1 WHERE "Number" = $2`
	_, err := conn.Exec(ctx, query, money, number)
	return err
}

//конец функций для работы с картами Тройка
// --------------------------------------------------------------
//функции для работы со штрафами

func GetFines(conn *pgxpool.Pool, ctx context.Context, userId string)([]models.Fine, error){
	query := `
        SELECT id, "UIN", "Date-Time", "Status", "Sum"
        FROM "Parkovki"."Fine"
        WHERE user_id = $1;
    `

	rows, err := conn.Query(ctx, query, userId)
	if err != nil{
		return nil, err
	}
	defer rows.Close()

	var fines []models.Fine
	for rows.Next() {
		var fine models.Fine
		if err := rows.Scan(&fine.Id, &fine.UIN, &fine.DateTime, &fine.Status, &fine.Sum); err != nil{
			return nil, err
		}
		fines = append(fines, fine)
	}

	if rows.Err() != nil{
		return nil, rows.Err()
	}

	return fines, nil
}

func PayFine(conn *pgxpool.Pool, ctx context.Context, userId, UIN string) error{
	query := `
		UPDATE "Parkovki"."Fine"
		SET "Status" = True
		WHERE "user_id" = $1 and "UIN" = $2;
	`

	_, err := conn.Exec(ctx, query, userId, UIN)
	return err
}

func CountFinesByUIN(conn *pgxpool.Pool, ctx context.Context, UIN string) (int, error){
	query := `
        SELECT COUNT(*)
        FROM "Parkovki"."Fine"
        WHERE "UIN" = $1;
    `

	var count int
	err := conn.QueryRow(ctx, query, UIN).Scan(&count)
	if err != nil{
		return -1, err
	}

	return count, nil
}

func NewFine(conn *pgxpool.Pool, ctx context.Context, fine models.Fine) error{
	query := `
        INSERT INTO "Parkovki"."Fine" ("UIN", "Date-Time", "Status", "Sum", "user_id")
        VALUES ($1, $2, $3, $4, $5);
    `

	_, err := conn.Exec(ctx, query, *fine.UIN, *fine.DateTime, fine.Status, *fine.Sum, *fine.UserId)
	return err
}

//конец функций для работы со штрафами
// --------------------------------------------------------------
//функции для работы со льготами

func NewBenefit(conn *pgxpool.Pool, ctx context.Context, benefit models.Benefit) error {
	// Начальный запрос для добавления новой льготы и возврата её ID
	queryAddBenefit := `
		INSERT INTO "Parkovki"."Benefits" ("District", "Number", "Validity Period", user_id)
		VALUES ($1, $2, $3, $4)
		RETURNING id;
	`

	var benefitID int
	err := conn.QueryRow(ctx, queryAddBenefit, *benefit.District, *benefit.Number, *benefit.ValidityPeriod, *benefit.UserId).Scan(&benefitID)
	if err != nil {
		return err
	}

	// Запрос для вставки записей в таблицу Benefits_Parkovki для всех парковок из того же района
	queryLinkBenefitParkovki := `
		INSERT INTO "Parkovki"."Benefits_Parkovki" ("Benefits_id", "Parkovki_id")
		SELECT $1, park.id
		FROM "Parkovki"."Parkovki" AS park
		WHERE park."District" = $2;
	`

	_, err = conn.Exec(ctx, queryLinkBenefitParkovki, benefitID, *benefit.District)
	return err
}


func GetBenefits(conn *pgxpool.Pool, ctx context.Context, userId string)([]models.Benefit, error){
	query := `
        SELECT id, "District", "Number", "Validity Period"
        FROM "Parkovki"."Benefits"
        WHERE user_id = $1;
    `

	rows, err := conn.Query(ctx, query, userId)
	if err != nil{
		return nil, err
	}
	defer rows.Close()

	var benefits []models.Benefit
	for rows.Next() {
		var benefit models.Benefit
		if err := rows.Scan(&benefit.Id, &benefit.District, &benefit.Number, &benefit.ValidityPeriod); err != nil{
			return nil, err
		}
		benefits = append(benefits, benefit)
	}

	if rows.Err() != nil{
		return nil, rows.Err()
	}

	return benefits, nil
}

//конец функций для работы со льготами
// --------------------------------------------------------------
//функции для работы с парковками

func GetNumberOfSeats(conn *pgxpool.Pool, ctx context.Context, pId string) (int, error) {
	query := `SELECT "Number of seats" FROM "Parkovki"."Parkovki" WHERE id = $1`
	var availableSeats int
	err := conn.QueryRow(ctx, query, pId).Scan(&availableSeats)
	if err != nil{
		return -1, err
	}

	return availableSeats, err
}

func NewParkingSession(conn *pgxpool.Pool, ctx context.Context, parkingSession models.ParkingSession) error{
	query1 := `
		INSERT INTO "Parkovki"."ParkingSession" ("user_id", "parkovki_id", "Start Time")
        VALUES ($1, $2, $3)
	`

	_, err := conn.Exec(ctx, query1, *parkingSession.UserId, *parkingSession.ParkovkaId, *parkingSession.StartTime)

	if err != nil{
		return err
	}
	
	query2 := `
		UPDATE "Parkovki"."Parkovki"
        SET "Number of seats" = "Number of seats" - 1
        WHERE id = $1;
	`
	_, err = conn.Exec(ctx, query2, *parkingSession.ParkovkaId)

	return err
}

func EndParkingSession(conn *pgxpool.Pool, ctx context.Context, id, pId string) error{
	query1 := `
	 	DELETE FROM "Parkovki"."ParkingSession"
        WHERE id = $1;
	`

	_, err := conn.Exec(ctx, query1, id)
	if err != nil{
		return err
	}

	query2 := `
		UPDATE "Parkovki"."Parkovki"
        SET "Number of seats" = "Number of seats" + 1
        WHERE id = $1;
	`
	_, err = conn.Exec(ctx, query2, pId)
	
	return err
	
}

func GetCostOfSession(conn *pgxpool.Pool, ctx context.Context, pId string)(float64, error){
	var startTimeStr string
	var parkovkaId int
	
	query1 := `
		SELECT "Start Time", "parkovki_id" 
		FROM "Parkovki"."ParkingSession" 
		WHERE "id" = $1
	`

	err := conn.QueryRow(ctx, query1, pId).Scan(&startTimeStr, &parkovkaId)
	if err != nil{
		return -1, err
	}

	startTime, err := time.Parse(time.RFC3339, startTimeStr)
	endTime := time.Now()
	duration := endTime.Sub(startTime).Hours()

	var hourlyRateStr string

	query2 := `
		SELECT "Cost"
		FROM "Parkovki"."Parkovki"
		WHERE "id" = $1
	`

	err = conn.QueryRow(ctx, query2, parkovkaId).Scan(&hourlyRateStr)
	if err != nil{
		return -1, nil
	}

	hourlyRate, _ := strconv.Atoi(hourlyRateStr)

	totalCost := duration * float64(hourlyRate)
	
	return totalCost, nil
}

func GetParkingSessionAndBenefits(conn *pgxpool.Pool, ctx context.Context, id string) (*models.ParkingSessionAndBenefits, error){
	var session models.ParkingSession
	var benefits []models.Benefit
	var parking models.Parking
	
	query1 := `
		SELECT id, "Start Time", "parkovki_id" 
		FROM "Parkovki"."ParkingSession" 
		WHERE "user_id" = $1
	`

	err := conn.QueryRow(ctx, query1, id).Scan(&session.Id, &session.StartTime, &session.ParkovkaId)
	if err != nil{
		return nil, err
	}

	query2 := `
		SELECT "Zone Number", "Cost"
		FROM "Parkovki"."Parkovki"
		WHERE id = $1
	`

	err = conn.QueryRow(ctx, query2, *session.ParkovkaId).Scan(&parking.District, &parking.Cost)
	if err != nil{
		return nil, err
	}
	
	query3 := `
		SELECT b.id, b."District", b."Number", b."Validity Period", b.user_id
		FROM "Parkovki"."Benefits" b
		JOIN "Parkovki"."Benefits_Parkovki" bp ON b.id = bp."Benefits_id"
		JOIN "Parkovki"."Parkovki" p ON p.id = bp."Parkovki_id"
		WHERE p.id = $1 AND b.user_id = $2
	`

	rows, err := conn.Query(ctx, query3, *session.ParkovkaId, id)
	if err != nil{
		return nil, err
	}
	defer rows.Close()

	for rows.Next(){
		var benefit models.Benefit
		err := rows.Scan(&benefit.Id, &benefit.District, &benefit.Number, &benefit.ValidityPeriod)
		if err != nil{
			return nil, err
		}
		benefits = append(benefits, benefit)

	}

	return &models.ParkingSessionAndBenefits{
		Session: session,
		Benefits: benefits,
		Parking: parking,
	}, nil
}

func GetParkingByDistrict(conn *pgxpool.Pool, ctx context.Context, district string)(*string, error){
	var pId string
	query := `SELECT id FROM "Parkovki"."Parkovki" WHERE "Zone Number" = $1;`

	err := conn.QueryRow(ctx, query, district).Scan(&pId)
	if err != nil{
		return nil, err
	}

	return &pId, nil
}