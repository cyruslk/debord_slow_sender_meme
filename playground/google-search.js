const GoogleImages = require('google-images');
var CSEID = "000196214579518959310:vryccwetxle";
var APIKEY = "AIzaSyAzSQWvEg-ArJl_6t2aNneX--hNNSdd-N8";

const client = new GoogleImages(CSEID, APIKEY);

client.search('test', {size: 'xxlarge'})
	.then(images => {
    console.log(images);
	})
	.catch(error => {
		console.log(error);
	})
