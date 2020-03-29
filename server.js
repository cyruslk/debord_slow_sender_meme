const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
const fs = require('fs');
const path = require("path");
const request = require('request');
const searchImages = require('pixabay-api');
const axios = require('axios');
const tesseract = require('node-tesseract');
const Scraper = require ('images-scraper');
const google = new Scraper.Google();
const config = require('./config.js');
const {MongoClient} = require("mongodb");
const connectionURL = config.mongoConnectionURL;
const databaseName = config.mongoDatabaseName;
const collectionCounter = config.mongodbCollectionCounter;
const GoogleImages = require('google-images');
const client = new GoogleImages(config.googleImageSearchID, config.googleImageAPI);

// tensorflow
const mobilenet = require('@tensorflow-models/mobilenet');
const tfnode = require('@tensorflow/tfjs-node');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});

let wordReference;
let imageLink;

const runTheBot = () => {
  connectToTheDb();
};

const connectToTheDb = () => {
  MongoClient.connect(connectionURL, function(err, db) {
    if (err) throw err;
    var databaseMongo = db.db(databaseName);
    databaseMongo.collection(collectionCounter).findOne({}, function(err, result) {
      if (err) throw err;
      wordReference = result;
      return getTheWordOnPdfFile(wordReference)
      db.close();
    });
  });
}

const getTheWordOnPdfFile = (wordReference) => {
  if(wordReference.wordPosition === wordReference.numberOfWordsInPage){
    // then run the bot() again with new counter params;
  }
  let pageNumberToString = wordReference.pageNumber.toString();
  let selectedFile = `${pageNumberToString}.txt`;
  let filePath =  path.join(__dirname, "files", selectedFile);

  fs.readFile(filePath, function read(err, data) {
       if (err) throw err;
       let text = data.toString('utf8').replace(/\0/g, '').split(" ");
       let selectedWord = text[wordReference.wordPosition];
       return performTheGoogleSearch(selectedWord)
  });
}

const performTheGoogleSearch = (selectedWord) => {
  client.search(selectedWord, {size: 'large'})
  .then(imageArray => {
    imageLink = imageArray[0];
    console.log(imageLink);
  })
  .then(() => {
    // return performTheImageClassification()
  })
};


const readImage = path => {
  const imageBuffer = fs.readFileSync(path);
  const tfimage = tfnode.node.decodeImage(imageBuffer);
  return tfimage;
}


// const performTheImageClassification = async path  => {
//     const image = readImage("img_to_predict/actual.jpeg");
//     console.log(image);
//      const mobilenetModel = await mobilenet.load();
//      const predictions = await mobilenetModel.classify(image);
//      console.log('Classification Results:', predictions);
// }




runTheBot();


app.listen(port, () => {
  console.log('listening on port ' + port)
});
