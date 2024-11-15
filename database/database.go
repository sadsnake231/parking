package database

import(
	"context"
	"os"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"

)

func ConnectToDb() *pgxpool.Pool{
	dbpool, err := pgxpool.New(context.Background(), "postgres://postgres:mynewpassword@localhost:5432/Parking")
	if err != nil{
		fmt.Fprintf(os.Stderr, err.Error())
	}
	
	return dbpool
}