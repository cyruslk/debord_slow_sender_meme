const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');


var fs = require('fs');
    request = require('request');

var tesseract = require('node-tesseract');
var Scraper = require ('images-scraper')
  , google = new Scraper.Google();


let counter = 10;
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
          const currentImageUrl = res[0].thumb_url;

          // writing here the link of the image, may be not necessary
          fs.writeFile('db/links.txt', currentImageUrl, function(err) {
            console.log("01. writing the link of the img to the db/links.txt");
          })

          // Downloading the img to the filesystem
          var download = function(uri, filename, callback){
            request.head(uri, function(err, res, body){
              console.log('content-type:', res.headers['content-type']);
              console.log('content-length:', res.headers['content-length']);
              request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
            });
          };
          download(`${currentImageUrl}`, '01.jpg', function(){
            console.log("02. getting the local version of the img");
            // Send it to the browser here
          });
      }).catch(function(err) {
          console.log('err', err);
      });
  });
}

// get from the filesystem the list of images link
const imagesLinks = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJtwTQ1Rl4NYhdKvg86U8-_pYxkEBuq6Jx76Q4Og-7NMekHfelxg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDkJBRK5ludjSYFYpWqm4xfAmMoH2Ap8UEHfYn5hisBS8U8DvC8Q",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR41NE2pdAd_-801AyjFuuXye6TKFUENRjQxXlXC3l0PR8lQIKFFg"
]
app.get('/api/hello', (req, res) => {
  res.send({ express: imagesLinks });
});

app.listen(port, () => {
  console.log('listening on port ' + port)
});
