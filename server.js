const express = require('express');
const recognize = require('tesseractocr')
const translate = require('google-translate-api');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
var fs = require('fs');
    request = require('request');

const GoogleImages = require('google-images');

const CONFIG = require('./config.js');
var CSEID = CONFIG.CSEID;
var APIKEY = CONFIG.APIKEY;

const client = new GoogleImages(CSEID, APIKEY);

let memeMaker = require('meme-maker')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});

let link;
let pageNumber;
let counterWord;
let numberOfWordsInThePage;
let initialWord;
let alteredWord;


setInterval(function runTheBot(){

  fs.readFile('db/currentPage.txt', function read(err, data) {
      if (err) {
          throw err;
      }
      pageNumber = Number(data.toString('utf8'));
      link = `files/CommentairesSurLaSocieteDuSpectacle-${pageNumber}.png`;

      recognize(link, (err, text) => {
         if(err){
             return console.log("An error occured: ", err);
         }

          const pageArray = text.split(" ");
          numberOfWordsInThePage = text.split(" ").length;

          fs.readFile('db/counter.txt', function read(err, data) {
            if (err) {
                throw err;
            }
            counterWord = Number(data.toString('utf8'));

            if(counterWord === numberOfWordsInThePage){
                fs.writeFile('db/currentPage.txt', `${pageNumber+1}`, function(err) {
                  console.log("changing page");
                })
                fs.writeFile('db/counter.txt', `0`, function(err) {
                  console.log("resetting the counter");
                })
            }
            fs.readFile('db/counter.txt', function read(err, data) {
              if (err) {
                  throw err;
              }
              initialWord = pageArray[counterWord];
              client.search(initialWord, {size: 'xxlarge'})
              	.then(images => {

                  const randomImageFromTheWord =
                  images[Math.floor(images.length * Math.random())].url
                  console.log(randomImageFromTheWord);
                  console.log("sent to the client");

                  var download = function(uri, filename, callback){
                    request.head(uri, function(err, res, body){
                      console.log('content-type:', res.headers['content-type']);
                      console.log('content-length:', res.headers['content-length']);
                      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                    });
                  };
                  download(`${randomImageFromTheWord}`, 'client/src/img.jpg', function(){
                    console.log("02. getting the local version of the img");
                    fs.writeFile('db/counter.txt', `${counterWord+1}`, function(err) {
                       console.log("incrementing the counter");
                     })
                  });
              	});
            });
          });
      });
  });
},30000)



app.post('/classifier', (req, res) => {
    const firstPrediction = req.body.data.split(", ")[0];
    alteredWord = firstPrediction.toUpperCase();
    console.log("--", initialWord, alteredWord, counterWord, pageNumber);



    let options = {
      image: 'client/src/img.jpg',         // Required
      outfile: `img_final${counterWord}-${pageNumber}.jpg`,  // Required
      topText: `${initialWord.toUpperCase()}`,            // Required
      bottomText: `${alteredWord.toUpperCase()}`,          // Optional
      fontSize: 70,                   // Optional
      fontFill: '#FFF',               // Optional
      textPos: 'center',              // Optional
      strokeColor: '#000',            // Optional
      strokeWeight: 2                 // Optional
    }

    memeMaker(options, function(err) {
      if(err) throw new Error(err)
      console.log('Image saved: ' + options.outfile)
    });


    //
    // fs.appendFile('db/words.txt', `${firstPrediction} `, function (err) {
    //   if (err) throw err;
    // });
})






app.listen(port, () => {
  console.log('listening on port ' + port)
});
