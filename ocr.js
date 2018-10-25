var tesseract = require('node-tesseract');
var Scraper = require ('images-scraper')
  , google = new Scraper.Google();



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

    }).catch(function(err) {
        console.log('err', err);
    });
});
