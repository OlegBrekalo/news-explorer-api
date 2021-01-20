# news-explorer-api

### Олег Брекало Maroon-15

Бэкенд для дипломного проекта Yandex.Praktikum

## URL

### api.news.brekalo.students.nomoreparties.space

### www.api.news.brekalo.students.nomoreparties.space

## Эндпойнты

### POST /signin

##### input: {email, password, name (необязательно)}

##### output: {email, name}

Регистрация нового пользователя

### POST /signup

##### input: {email, password, name (необязательно)}

##### output: {email, name}

Получения токена авторизации для зарегестрированного пользователя

### GET/users/me

##### input: {}

##### output: {email, name}

Получение сведений о себе

### GET /article

##### input: {}

##### output: [{keyword, title, text, date, source, link, image, owner}]

Получить все сохраненные пользователем статьи

### POST /article

##### input: {keyword, title, text, date, source, link, image}

##### output: {keyword, title, text, date, source, link, image, owner}

Сохранить статью

### DELETE /article/:ID

##### input: {}

##### output: {message}

Удалить статью по ID

## About

Этап II дипломного проекта для Яндекс.Практикума. Славный API авторизации и сохранения статей для пользователей. Написан, протестирован, задеплоен.
