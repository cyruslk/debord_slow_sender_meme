import React, { Component } from 'react';
import './App.css';
import img from "./img.jpg";
// Importing ml5.js as ml5
import * as ml5 from "ml5";
import axios from 'axios';


class App extends Component {
  state = {
    predictions: []  // Set the empty array predictions state
  }

  setPredictions = (pred) => {
    this.setState({
      predictions: pred
    });
  }

  classifyImg = () => {
    const classifier = ml5.imageClassifier('MobileNet', modelLoaded);
    function modelLoaded() {
      console.log('Model Loaded!');
    }
    const image = document.getElementById('image');
    classifier.predict(image, 5, function(err, results) {
      return results;
    })
      .then((results) => {
        this.setPredictions(results)
      })
  }

  componentDidMount(){
    this.classifyImg();
  }

  sendDataBackToServer = (stuffToSend) => {
    return axios.post('/api/classifier', stuffToSend);
  }

  render() {
      if(this.state.predictions.length === 0){
        return (
          <div className="words">
          <img src={ img } id="image" style={{display: "none"}} alt="" />
            loading
          </div>
        )
      }else{
        console.log(this.state.predictions);
        return (
          <div className="words">
          <img src={ img } id="image" style={{display: "none"}} alt="" />
            sent
          </div>
        )
        this.sendDataBackToServer(this.state.predictions);
      }
  }
}

export default App;
