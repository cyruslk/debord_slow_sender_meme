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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});

let wordReference;

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
    // insert in the db;
    // then run the bot();
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
  console.log(selectedWord);
}


runTheBot();


app.listen(port, () => {
  console.log('listening on port ' + port)
});
