package helpers

import(
	"github.com/golang-jwt/jwt"
	"context"
)

func CookieCheck(ctx context.Context, cookie string, err error, SecretKey string) (string, error) {
	if err != nil{
		return "", err
	}
	
	token, err1 := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token)(interface{}, error){
		return []byte(SecretKey), nil
	})

	if err != nil{
		return "", err1
	}

	claims := token.Claims.(*jwt.StandardClaims)
	id := claims.Issuer

	return id, nil
}