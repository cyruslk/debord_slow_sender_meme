var Scraper = require ('images-scraper')
  , google = new Scraper.Google();
 
google.list({
    keyword: 'COMMENTAIRES',
    num: 1,
    detail: true,
    nightmare: {
        show: true
    }
})
.then(function (res) {
    console.log('first 10 results from google', res);
    console.log(res[0].thumb_url);
}).catch(function(err) {
    console.log('err', err);
});
 
// you can also watch on events
google.on('result', function (item) {
    console.log('out', item);
});