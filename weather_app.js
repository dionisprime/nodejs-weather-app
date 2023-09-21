const { format } = require('date-fns');
const http = require('http'); // встроенный модуль http
const server = http.createServer().listen(3000, () => {
    console.log(`Server is listening...`);
}); // создание сервера, порт 3000

const HOST = 'http://localhost';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
server.on('request', (req, res) => {
    if (req.url === '/favicon.ico') {
        return res.end();
    }
    const urlParams = new URL(HOST + req.url); // формируем объект URL с помощью встроенного класса
    const cityName = urlParams.searchParams.get('city');
    const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                res.end('Error');
                throw new Error('Нет ответа');
            }
            return response.json();
        })
        .then((data) => {
            const citySunset = format(
                new Date(data.sys.sunset * 1000),
                'HH:mm'
            );
            const cityWeather = `conditions for ${data.name} is ${data.weather[0].main}. Sunset: ${citySunset}`;
            console.log(cityWeather);
            res.end(cityWeather);
        })
        .catch((error) => {
            console.error(error);
            res.end('Ошибка!');
        });
});
