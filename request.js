var fs = require('fs'),
    request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

download('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJsSSDIjCTNTh0EBHXeviNWrzdGRFljLoWGCZbw471KKW1H1WG', '01.jpg', function(){
  console.log('done');
});