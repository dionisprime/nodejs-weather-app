const { format } = require('date-fns');
const http = require('http');
const server = http.createServer().listen(3001, () => {
    console.log('Server is listening...');
});

const HOST = 'http://localhost';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';

server.on('request', async (req, res) => {
    try {
        if (req.url === '/favicon.ico') {
            return res.end();
        }
        const urlParams = new URL(HOST + req.url);
        const cityName = urlParams.searchParams.get('city');

        const cityWeather = await getCityWeather(cityName);

        console.log('cityWeather: ', cityWeather);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(cityWeather);
    } catch (error) {
        console.error('Error: ', error.message);
        res.end(error.message);
    }
});

async function getCityWeather(cityName) {
    const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;
    const response = await fetch(url);
    const weatherData = await response.json();

    if (weatherData.cod === '404') {
        throw new Error(weatherData.message);
    }

    const citySunset = format(new Date(weatherData.sys.sunset * 1000), 'HH:mm');

    return `Conditions for ${weatherData.name} is ${weatherData.weather[0].main}. Sunset: ${citySunset}`;
}
