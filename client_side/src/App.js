import React, { Component } from 'react';
import './App.css';
import axios from "axios";


import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";



class App extends Component {
  constructor(){
    super()
    this.state = {
      dbContent: null
    };
  }

  componentDidMount(){
    this.client = Stitch.initializeDefaultAppClient("debord_slow_sender-eabsu");
    const mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    this.db = mongodb.db("debord_slow_sender");
    this.retrieveDataFromDBOnLoad()
  }

  retrieveDataFromDBOnLoad = () => {
    this.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(this.retrieveDataFromDB)
      .catch(console.error);
  };

  retrieveDataFromDB = () => {
     this.db
       .collection("meme_entries")
       .find()
       .asArray()
       .then(dbContent => {
         this.setState({dbContent});
       });
    }

  displayMeme = () => {
    const dbContent = this.state.dbContent;
    if(!dbContent){
      return null;
    }
    let generateMemesFromDb = this.state.dbContent
    .map((ele, index) => {
      return (
        <div key={index} className="memes">
          <h1>{ele.word}</h1>
          <img src={ele.imageLink} />
          <h1>{ele.translatedPrediction}</h1>
        </div>
      )
    })
    return generateMemesFromDb;
  }


  render() {
    console.log(this.state);
    return (
      <div className="App">
        {this.displayMeme()}
      </div>
    );
  }
}
export default App;
