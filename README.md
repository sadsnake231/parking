# Приложение "Парковки"

Предоставляет пользователю возможность работать с парковочными сессиями, оплачивать проезд по платным дорогам, оформлять льготы, оплачивать штрафы и работать с картами "Тройка".

## Принципы работы приложения

Это учебное приложение создано для использования автомобилистами. Поэтому штрафы, парковки и проезды по платным дорогам вручную вносятся через СУБД.
Привязка карты "Тройка" и оформление льготы эмулируются - для карты "Тройка" генерируются случайным образом баланс и срок действия, для льготы - срок действия и уникальный номер.

## Технологии

**База данных:**

PostgreSQL

**Серверная часть:**

* Golang
* Gin - фреймворк для работы с http 
* pgx - драйвер для работы с PostgreSQL
* golang-jwt - библиотека для генерации jwt токенов; crypto - хеширование паролей; cors - работа с CORS

**Интерфейс:**

* JavaScript
* React - фреймворк для создания интерфейса
* Axios - библиотека для создания запросов