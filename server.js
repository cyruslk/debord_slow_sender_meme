const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
var fs = require('fs');
    request = require('request');

const searchImages = require('pixabay-api');
const axios = require('axios');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});


var tesseract = require('node-tesseract');
var Scraper = require ('images-scraper')
  , google = new Scraper.Google();


let link;
let pageNumber;
let numberOfWordsInThePage;

function runTheBot(){

  fs.readFile('db/currentPage.txt', function read(err, data) {
      if (err) {
          throw err;
      }
      pageNumber = Number(data.toString('utf8'));

      link = `'files/CommentairesSurLaSocieteDuSpectacle-${pageNumber}.png'`;

      tesseract.process(link, (err, text) => {
         if(err){
             return console.log("An error occured: ", err);
         }
          const pageArray = text.split(" ");
          numberOfWordsInThePage = text.split(" ").length;

          fs.readFile('db/counter.txt', function read(err, data) {
            if (err) {
                throw err;
            }
            const counterWord = Number(data.toString('utf8'));
            // console.log(counterWord, numberOfWordsInThePage);

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
               const counterWord = Number(data.toString('utf8'));
            });
              google.list({
                  keyword: `${pageArray[counterWord]}`,
                  num: 1,
                  detail: true,
                  nightmare: {
                      show: false
                  }

                })
                .then(function (res) {
                    const currentImageUrl = `${res[0].thumb_url} `;
                    fs.appendFile('db/links.txt', currentImageUrl, function (err) {
                      if (err) throw err;
                      console.log('Saved: db/links.txt');
                    });
                    var download = function(uri, filename, callback){
                      request.head(uri, function(err, res, body){
                      console.log('content-type:', res.headers['content-type']);
                      console.log('content-length:', res.headers['content-length']);
                        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                      });
                    };
                    download(`${currentImageUrl}`, 'client/src/img.jpg', function(){
                      console.log("02. getting the local version of the img");
                      fs.writeFile('db/counter.txt', `${counterWord+1}`, function(err) {
                        // console.log("incrementing the counter");
                      })
                    });
              }).catch(function(err) {
                  console.log('err', err);
              });
          });
      });
  });
}


setInterval(function() {
  let IntervalOfThePage = numberOfWordsInThePage;
  runTheBot();
}, IntervalOfThePage);




var imagesLinks;
fs.readFile('db/links.txt', function read(err, data) {
    if (err) {
        throw err;
    }
    imagesLinks = data.toString('utf8').split(" ");
});
app.get('/api/img', (req, res) => {
    res.send({ express: imagesLinks });
});

app.post('/classifier', (req, res) => {
    const firstPrediction = req.body.data.split(", ")[0];
    console.log(firstPrediction);
    fs.appendFile('db/words.txt', `${firstPrediction} `, function (err) {
      if (err) throw err;
      console.log('Saved: db/words.txt');
    });
})

var wordsProcessed;
    fs.readFile('db/words.txt', function read(err, data) {
      if (err) {
          throw err;
      }
      wordsProcessed = data.toString('utf8').split(" ");
  });
  app.get('/api/words', (req, res) => {
    res.send({ express: wordsProcessed });
  });


app.listen(port, () => {
  console.log('listening on port ' + port)
});
