import request from 'request';

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const city = req.query.city || (req.body && req.body.city);
    if (!city) {
        context.res = {
            status: 400,
            body: "Please pass a city in the query string or in the request body"
        };
        return;
    }

    // Get the weather data for the city
    const weatherData = await getWeatherData(city);

    // Check if it is raining today
    const isRaining = await isItRainingToday(weatherData);

    // Return the weather data and whether it is raining today
    context.res = {
        body: `${city}: ${weatherData}\nIs it raining today? ${isRaining}`
    };
};

function getWeatherData(city) {
    return new Promise((resolve, reject) => {
        // Replace YOUR_API_KEY with your actual API key
        const apiKey = "5d527d0bfbfb75c7b59f1a2580b5f936";
        const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        request(apiUrl, { json: true }, (err, res, body) => {
            if (err) {
                reject("Error getting weather data");
            } else {
                resolve(body);
            }
        });
    });
}

function isItRainingToday(weatherData) {
    return new Promise((resolve, reject) => {
        // Check if the weather condition includes the word "rain"
        if (weatherData.weather[0].description.includes("rain")) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}
