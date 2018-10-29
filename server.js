const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
var fs = require('fs');
    request = require('request');


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

var counter;
  fs.readFile('db/counter.txt', function read(err, data) {
    if (err) {
        throw err;
    }
    counter = Number(data.toString('utf8'))
});

// Q1: DELAY
runProcess();

function runProcess(){
  return tesseract.process('files/CommentairesSurLaSocieteDuSpectacle-01.png', (err, text) => {
      if(err){
          return console.log("An error occured: ", err);
      }
      const textArray = text.split(" ");
      google.list({
          keyword: `${textArray[counter]}`,
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
            fs.writeFile('db/counter.txt', `${counter+1}`, function(err) {
              console.log("incrementing the counter");
            })
          });
      }).catch(function(err) {
          console.log('err', err);
      });
  });
}

var imagesLinks;
  fs.readFile('db/links.txt', function read(err, data) {
    if (err) {
        throw err;
    }
    imagesLinks = data.toString('utf8').split(" ");
    console.log(imagesLinks.length, "");
});
app.get('/api/img', (req, res) => {
  res.send({ express: imagesLinks });
});

app.post('/classifier', (req, res) => {
  console.log(req.body);
  const firstPrediction = req.body.data.split(", ")[0];

  fs.appendFile('db/words.txt', `${firstPrediction} `, function (err) {
    if (err) throw err;
    console.log('Saved: db/words.txt');
  });
})
// Now, take the content from the db/words.txt and
//send it back to the client in order to be displayed

app.listen(port, () => {
  console.log('listening on port ' + port)
});
