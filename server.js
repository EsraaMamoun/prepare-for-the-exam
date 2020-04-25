// 'use strict';

// require('dotenv').config();
// const cors = require('cors');
// const express = require('express');
// const PORT = process.env.PORT || 4000;

// const app = express();
// const superagent = require('superagent');
// app.use(cors());

// app.get('/geo', location);

// function Location(city, data) {
//   this.search_query = city;
//   this.formated = data[0].display_name;
//   this.latitude = data[0].lat;
//   this.langitude = data[0].lon;
//   this.type = data[0].type;
// }

// function location(req,res) {
//   try {
//     const thePath = require('./data/geo.json');
//     const city = req.query.city;
//     const theGeo = new Location(city,thePath);
//     res.status(200).json(theGeo);
//   } catch (error) {
//     errorHandler(error,req,res);
//   }
// }

// ///////////////////////////////////////////////////////////////

// function Weather(datta, idx) {
//   this.wind_cdir_full = datta.data[idx].wind_cdir_full;
//   this.description = datta.data[idx].weather.description;
//   this.valid_date = (new Date(datta.data[idx].valid_date)).toDateString();
// }

// app.get('/weather', (req,res) => {
//   try {
//     let allWeather = [];
//     const theDarkSky = require('./data/darksky.json');
//     for (let i = 0; i < theDarkSky.data.length; i++) {
//       let theWeatherArray = new Weather(theDarkSky,i);
//       allWeather.push(theWeatherArray);
//     }
//     res.status(200).json(allWeather);
//   } catch (error) {
//     errorHandler(error,req,res);
//   }
// })
// ////////////////////////////////////////////////////////
// app.get('/location', (req,res)=>{
//   const city = req.query.city;
//   superagent(`https://eu1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`)
//     .then((response)=>{
//       const theData = response.body;
//       const forLocation = new Location(city,theData);
//       res.status(200).json(forLocation);
//     })
//     .catch((err)=>{
//       errorHandler(err,req,res);
//     })
// })
// ////////////////////////////////////////////////////////

// function WeatherS(datta) {
//   this.wind_cdir_full = datta.wind_cdir_full;
//   this.description = datta.weather.description;
//   this.valid_date = (new Date(datta.valid_date)).toDateString();
// }

// app.get('/for/weather', (req,res)=>{
//   const search = req.query.search_query;
//   superagent(`https://api.weatherbit.io/v2.0/forecast/daily?city=${search}&key=${process.env.WEATHER_API_KEY}`)
//     .then((response)=>{
//       const forWeather = response.body.data.map((whether)=>{
//         return new WeatherS(whether);
//       });
//       res.status(200).json(forWeather);
//     })
//     .catch((err)=>errorHandler(err,req,res))
// })
// ///////////////////////////////////////////////////////

// function Trails(theTrails) {
//   this.name = theTrails.name;
//   this.location = theTrails.location;
//   this.length = theTrails.length;
//   this.stars = theTrails.stars;
//   this.star_votes = theTrails.starVotes;
//   this.summary = theTrails.summary;
//   this.trail_url = theTrails.trail_url;
//   this.conditions = theTrails.conditionStatus;
//   this.condition_date = theTrails.conditionDate.slice(0,10);
//   this.condition_time = theTrails.conditionDate.slice(12,19);
// }

// app.get('/trails',(req,res)=>{
//   superagent(`https://www.hikingproject.com/data/get-trails?lat=${req.query.latitude}&lon=${req.query.longitude}&maxDistance=400&key=${process.env.TRAIL_API_KEY}`)
//     .then((response)=>{
//       const forTrails = response.body.trails.map((theTrails)=>{
//         return new Trails(theTrails);
//       })
//       res.status(200).json(forTrails);
//     }).catch((err)=>errorHandler(err,req,res))
// })
// ///////////////////////////////////////////////////////



// ///////////////////////////////////////////////////////
// app.get('/bad',(req,res)=>{
//   throw new Error('ERROR!!');
// })

// app.use('*', notFound);

// function notFound(req,res) {
//   res.status(404).send('NOT FOUND !!');
// }

// function errorHandler(error,req,res) {
//   res.status(500).send(error);
// }

// app.listen(PORT, ()=>console.log(`My app is listen on ${PORT}`));


'use strict';

require('dotenv').config();

const cors = require('cors');
const express = require('express');
const methodOverride = require('method-override');
const superagent = require('superagent');
const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());

const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (err) => console.log(err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/public', express.static('public'));

//////////////////////////////////////////////////

app.get('/search', (req, res) => {
  res.render('search');
})

app.post('/showP', (req, res) => {
  const searchInput = req.body.theSearch;
  const radioValue = req.body.titleOrAouthor;
  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}+in${radioValue}`)
    .then(data => {
      let allBook = data.body.items.map((book) => {
        return new Book(book);
      })
      res.render('show', { allBook: allBook });
    }).catch((err) => {
      errorHandler(err, req, res);
    });
  console.log(`The results from post: ${searchInput} and ${searchInput}`);
})

//////////////////////////////////////////////////

app.get('/', (req, res) => {
  let SQL = 'SELECT * FROM exam';
  client.query(SQL).then((result) => {
    res.render('index', { books: result.rows });
  }).catch((err) => errorHandler(err, req, res))
})

///////////////////////////////////////////////////
//get Form
app.get('/add', (req, res) => {
  res.render('add');
})
//add
app.post('/add',(req,res)=>{
  const {author,title,isbn,image_url,description,bookshelf} = req.body;
  let SQL = 'INSERT INTO exam (author,title,isbn,image_url,description,bookshelf) VALUES ($1,$2,$3,$4,$5,$6)';
  let values = [author,title,isbn,image_url,description,bookshelf];
  client.query(SQL,values).then((result)=>{
    res.redirect('/');
  }).catch((err)=>errorHandler(err,req,res));
})

//////////////////////////////////////////////////
//View Details
app.get('/book/:id',(req,res)=>{
  const SQL = 'SELECT * FROM exam WHERE id=$1';
  const value = [req.params.id];
  client.query(SQL,value).then((result)=>{
    res.render('details', {aBook: result.rows[0]});
  }).catch((err)=>errorHandler(err,req,res));
})

//////////////////////////////////////////////////

app.put('/update/:id', (req,res)=>{
  const { author, title, isbn, image_url, description, bookshelf} = req.body;
  const SQL = 'UPDATE exam SET author=$1, title=$2, isbn=$3, image_url=$4, description=$5, bookshelf=$6 WHERE id=$7';
  const value = [author, title, isbn, image_url, description, bookshelf,req.params.id];
  client.query(SQL,value).then((result)=>{
    res.redirect(`/book/${req.params.id}`);
  }).catch((err)=>errorHandler(err,req,res));
})
///////////////////////////////////////////////////

app.delete('/delete/:id',(req,res)=>{
  let SQL = 'DELETE FROM exam WHERE id=$1';
  let value = [req.params.id];
  client.query(SQL,value).then((result)=>{
    res.redirect('/');
  }).catch((err)=>errorHandler(err,req,res));
})

//////////////////////////////////////////////////

function Book(theBook) {
  this.imageLinks = theBook.volumeInfo.imageLinks.thumbnail;
  this.title = theBook.volumeInfo.title;
  this.authors = theBook.volumeInfo.authors;
  this.description = theBook.volumeInfo.description;
}

/////////////////////////////////////////////////

function errorHandler(err, req, res) {
  res.status(500).send(err);
}

app.get('*', notFound);

function notFound(req, res) {
  res.status(404).send('NOT FOUND !!')
}
client.connect().then(() => {
  app.listen(PORT, () => console.log(`My app listening on ${PORT}`));
});
