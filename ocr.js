var fs = require('file-system');

var tesseract = require('node-tesseract');
var Scraper = require ('images-scraper')
  , google = new Scraper.Google();

let tracker = 0;


tesseract.process('t_1.png', (err, text) => {
    if(err){
        return console.log("An error occured: ", err);
    }
    const textArray = text.split(" ");
    google.list({
        keyword: `${textArray[tracker]}`,
        num: 1,
        detail: true,
        nightmare: {
            show: false
        }
    })
    .then(function (res) {
      
        console.log(res[tracker].thumb_url);
        
        
        fs.writeFile('db/links.txt', res[tracker].thumb_url, function(err) {})
        tracker = tracker+1;
        console.log(tracker, "here");


    }).catch(function(err) {
        console.log('err', err);
    });
});
