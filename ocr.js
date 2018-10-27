var fs = require('fs');
    request = require('request');

var tesseract = require('node-tesseract');
var Scraper = require ('images-scraper')
  , google = new Scraper.Google();


let counter = 4;  
runProcess();  
  
function runProcess(){
  return tesseract.process('t_1.png', (err, text) => {
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
        // RES IS THE IMAGE
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
          });
      }).catch(function(err) {
          console.log('err', err);
      });
  });
}
