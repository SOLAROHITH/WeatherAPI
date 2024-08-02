import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
const app = express();
const port = 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Replace this with your actual API key
const API_key = "84d83e24bbaa885af8e25caeeabf0f8c";

// Handle GET requests to render the form
app.get('/', (req, res) => {
    res.render('index', { weather: null });
});
let city;
// Handle POST requests to fetch weather data
app.post('/getcity', async (req, res) => {
    city = req.body.city;
    console.log(city);
    res.redirect("/getcoordinates");
});


let latitutde;
let longitude;
app.get('/getcoordinates',async (req,res)=>{
    try {
        const geoResponse = await axios.get("http://api.openweathermap.org/geo/1.0/direct?q="+city+",IN&limit=1&appid=84d83e24bbaa885af8e25caeeabf0f8c");
        console.log(geoResponse.data);
        latitutde = JSON.stringify(geoResponse.data[0].lat);
        longitude = JSON.stringify(geoResponse.data[0].lon);
        console.log(latitutde);
        console.log(longitude);
    
        const tempResponse = await axios.get("https://api.openweathermap.org/data/2.5/weather?lat="+latitutde+"&lon="+longitude+"&appid=84d83e24bbaa885af8e25caeeabf0f8c");
        console.log(tempResponse.data);
        const temperature = JSON.stringify((tempResponse.data.main.temp-273.15).toFixed(2));
        const humidity = JSON.stringify(tempResponse.data.main.humidity);
        const nameCity = JSON.stringify(tempResponse.data.name);
        const feels_like =JSON.stringify((tempResponse.data.main.feels_like-273.15).toFixed(2));
        const pressure = JSON.stringify(tempResponse.data.main.pressure);
        const description = JSON.stringify(tempResponse.data.weather[0].description);

        res.render('index.ejs',{
            cityname : city,
            citytemp : temperature,
            cityhumidity : humidity,
            feelslike :feels_like,
            pressure : pressure,
            description : description 

        })
        
    } catch (error) {
        console.log("error:"+error);
        res.redirect("/");
    }

    // res.redirect('/getInfo');
})
// app.get('/getInfo',async (res,req)=>{
//     const tempResponse = await axios.get("https://api.openweathermap.org/data/2.5/weather?lat="+latitutde+".34&lon="+longitude+"&appid=84d83e24bbaa885af8e25caeeabf0f8c")
//     console.log(tempResponse.data);
//     // const  temperature = JSON.stringify(tempResponse.data.)
// })
// app.get('/',async (req,res)=>{
//     const geoResponse = await axios.get("http://api.openweathermap.org/geo/1.0/direct?q="+city+",IN&limit=1&appid=84d83e24bbaa885af8e25caeeabf0f8c");
//     console.log(geoResponse.data);
// })








app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
