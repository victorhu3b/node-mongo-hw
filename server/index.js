const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const mongoose = require('mongoose')
const cors = require('cors');
const url = 'mongodb://127.0.0.1:27017/node-mongo-hw' // change this as needed

mongoose.connect(url, { useNewUrlParser: true })

const Schema = mongoose.Schema;

const item = new Schema({
  img: String,
	date: String,
});

const APOD = mongoose.model("APOD", item);

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

const app = express();

app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();


// The method of the root url. Be friendly and welcome our user :)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the APOD app.' });   
});

router.get('/apod', function(req, res) {
    //d0rDMsFtrqpzIadVfmPcVRHnyvFDNIyi5apTGB1m
    axios.get('https://api.nasa.gov/planetary/apod?api_key=d0rDMsFtrqpzIadVfmPcVRHnyvFDNIyi5apTGB1m&count=1').then( response => res.send(response.data)).catch( error => res.send(error))
});


router.get('/fav', function(req, res) {
  APOD.find().then((apods) => {
    res.json({ message: 'Return all apods.', apods: apods});
  })
});

router.put('/save', function(req, res) {
  console.log(req.body.img);
  const apod = new APOD({
    img: req.body.img,
    date: req.body.date,
  });
  apod.save((error, document) => {
		if (error) {
			res.json({ status: "failure" });
      console.log("error");
		} else {
      console.log("success");
			res.json({               
				status: "success",
      });
		}
  });
});

router.post('/unsave', function(req, res) {
  console.log(req.body.img);
  APOD.remove({ img: req.body.img }, function(err) {
    if (!err) {
      res.json({status: "success"});
    }
    else {
      res.json({status: "failure"});
    }
    console.log(err);
  });
});

app.use('/api', router); // API Root url at: http://localhost:8080/api

app.listen(port);
console.log('Server listenning on port ' + port);