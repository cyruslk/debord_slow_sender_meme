var tesseract = require('node-tesseract');
var Scraper = require ('images-scraper')
  , google = new Scraper.Google();
  

tesseract.process('t_1.png', (err, text) => {
    if(err){
        return console.log("An error occured: ", err);
    }
    console.log("here ---");
    console.log(text);
    const textArray = text.split(" ")
    const textArrayLength = textArray.length;
    console.log(textArray[0]);
    
    google.list({
        keyword: `${textArray[0]}`,
        num: 1,
        detail: true,
        nightmare: {
            show: true
        }
    })
    .then(function (res) {
        console.log('----', res);
        console.log(res[0].thumb_url);
    }).catch(function(err) {
        console.log('err', err);
    });
     
    google.on('result', function (item) {
        console.log('out', item);
    });
    
});