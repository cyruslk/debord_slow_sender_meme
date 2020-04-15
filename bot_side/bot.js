const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
const fs = require('fs');
const path = require("path");
const request = require('request').defaults({encoding: null});
const searchImages = require('pixabay-api');
const axios = require('axios');
const tesseract = require('node-tesseract');
const Scraper = require ('images-scraper');
const download = require('image-downloader');
const google = new Scraper.Google();
const config = require('./config.js');
const {MongoClient} = require("mongodb");
const memeMaker = require('meme-maker')
const connectionURL = config.mongoConnectionURL;
const databaseName = config.mongoDatabaseName;
const collectionCounter = config.mongodbCollectionCounter;
const memeEntry = config.memeEntry;
var cloudinary = require('cloudinary').v2;
const GoogleImages = require('google-images');
const client = new GoogleImages(config.googleImageSearchID, config.googleImageAPI);
const translate = require("translate");
const chokidar = require('chokidar');
const open = require('open');


// tensorflow;
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const tfnode = require('@tensorflow/tfjs-node');

translate.engine = 'yandex';
translate.key = config.yendexKey;


const outputData = {
  wordReference: null,
  numberOfWordsInPage: null,
  word: null,
  imageLink: null,
  predictions: null 
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});

// cloudinary config;
cloudinary.config({ 
  cloud_name: config.cloudinaryCloudName, 
  api_key: config.cloudinaryAPIKey, 
  api_secret: config.cloudinaryAPISecret 
});

// chockidar init;
const watcher = chokidar.watch('file, dir, glob, or array', {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});
const log = console.log.bind(console);

const runTheBot = () => {  
  getFromTheDb();
};

const getFromTheDb = () => {
  MongoClient.connect(connectionURL, 
    {useUnifiedTopology: true},
    (err, db) => {
    if (err) throw err;
    var databaseMongo = db.db(databaseName);
    databaseMongo.collection(collectionCounter).
    findOne({}, function(err, result) {
      if (err) throw err;
      outputData.wordReference = result;
      return getTheWordFromPage(outputData.wordReference);
      db.close();
    });
  });
}

const getTheWordFromPage = (wordReference) => {

  let pageNumberToString = wordReference.pageNumber.toString();
  let selectedFile = `${pageNumberToString}.txt`;
  let filePath =  path.join(__dirname, "files", selectedFile);

  fs.readFile(filePath, function read(err, data) {
      if (err) throw err;
      let text = data.toString('utf8').replace(/\0/g, '').split(" ");
      let selectedWord = text[wordReference.wordPosition];
      outputData.word = selectedWord; 
      outputData.numberOfWordsInPage = text.length;
      return performTheGoogleSearch(selectedWord)
  });
}

const performTheGoogleSearch = (selectedWord) => {
  client.search(selectedWord, {size: 'xxlarge',lr: 'lang_fr'})
  .then(imageArray => {
    let arrayOfJpegs = imageArray.filter((ele) => {
      return ele.url.includes(".jpg")
    });
    return arrayOfJpegs; 
  }).then(arrayOfJpegs => {
    // here, select what will be chosen
    // return img with best width and minimum height;
    outputData.imageLink = arrayOfJpegs[0].url;  
    let mapInside =  arrayOfJpegs.map((ele, index) => {
      open(ele.url);
      return ele.url;
    });   
  }).then(() => {
    const options = {
      url: outputData.imageLink,
      dest: 'img/actual.jpg'
    }
    download.image(options)
      .then(({ filename, image }) => { return imageClassification();})
      .catch((err) => console.error(err))
  })
};

const readImage = path => {
  const imageBuffer = fs.readFileSync("img/actual.jpg");
  const tfimage = tfnode.node.decodeImage(imageBuffer);
  return tfimage;
};

const imageClassification = async path => { 
  const image = readImage(path);
  const mobilenetModel = await mobilenet.load();
  const predictions = await mobilenetModel.classify(image);
  outputData.predictions = predictions;
  return translatePrediction(predictions);
};

const translatePrediction = (predictions) => {
  translate(predictions[0].className, { from: 'en', to: 'fr' })
  .then(translatedText => {
    let firsWordOfTranslatedText = translatedText.split(" ")[0];
    outputData.translatedPrediction = firsWordOfTranslatedText;
    return insertBotEntry(outputData);
  });
};

// will make an API for the db layer soon; refactor in promises; clean everything
// see https://github.com/aconanlai/gene_tellem/blob/master/src/GeneCanvas.js

const insertBotEntry = (outputData) => {

  MongoClient.connect(connectionURL, 
    {useUnifiedTopology: true},
    (err, db) => {
    if (err) throw err;
    var databaseMongo = db.db(databaseName);
    databaseMongo.collection(memeEntry).
    insertOne(
      outputData
    ).then(() => {
      if(outputData.wordPosition !== outputData.numberOfWordsInPage-1){
        return incrementTheWordPosition(outputData);
      }else{
        return turnThePageRestartCounter(outputData);
      }
    })
  }); 
};


const incrementTheWordPosition = (outputData) => {
  let wordPosition = parseInt(outputData.wordReference.wordPosition); 
  let numberOfWordsInPage = parseInt(outputData.numberOfWordsInPage); 
  MongoClient.connect(connectionURL, 
    {useUnifiedTopology: true},
    (err, db) => {
    if (err) throw err;
    var databaseMongo = db.db(databaseName);

    databaseMongo.collection(collectionCounter).
    updateOne(
      {id: "counter_bot"},
      {$set: {
        wordPosition: wordPosition+1,
        numberOfWordsInPage: numberOfWordsInPage
      }}
    );
  }); 
};

const turnThePageRestartCounter = (outputData) => {
  const wordReference = outputData.wordReference;
    MongoClient.connect(connectionURL, 
      {useUnifiedTopology: true},
      (err, db) => {
      if (err) throw err;
      var databaseMongo = db.db(databaseName);
      databaseMongo.collection(collectionCounter).
      updateOne(
        {id: "counter_bot"},
        {$set: {
          wordPosition: 0,
          numberOfWordsInPage: 0,
          pageNumber: wordReference.pageNumber+1
        }}
      );
    });
};

runTheBot();

app.listen(port, () => {
  console.log('listening on port ' + port)
});