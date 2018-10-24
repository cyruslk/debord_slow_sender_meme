var tesseract = require('node-tesseract');
var Scraper = require ('images-scraper')
  , google = new Scraper.Google();


tesseract.process('t_1.png', (err, text) => {
    if(err){
        return console.log("An error occured: ", err);
    }

    const textArray = text.split(" ");
    console.log(textArray.length, "--------");

    console.log(textArray[1]);

    google.list({
        keyword: `${textArray[1]}`,
        num: 1,
        detail: true,
        nightmare: {
            show: false
        }
    })
    .then(function (res) {
        // console.log('----', res);
        console.log(res[0].thumb_url);
    }).catch(function(err) {
        console.log('err', err);
    });

    // google.on('result', function (item) {
    //     console.log('out', item);
    // });

});
