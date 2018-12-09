import React, { Component } from 'react';
import './App.css';
import img from "./img.jpg";
import * as ml5 from "ml5";

class App extends Component {
  state = {
    predictions: []  // Set the empty array predictions state
  }

  setPredictions = (pred) => {
    // Set the prediction state with the model predictions
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



  sendDataBackToServer = (passedData) => {
  const data = {
       data: passedData
   };
  fetch('/classifier', {
       method: 'POST',
       body: JSON.stringify(data),
       headers: {
         'content-type': 'application/json'
       },
     }).then((res) => {
       console.log("successfully sent to db");
     })
   }


  render() {


    let predictions = (<div className="loader"></div>);
    if(this.state.predictions.length > 0){


      const mostAccurate =  this.state.predictions[0]["className"];
      this.sendDataBackToServer(mostAccurate);



      predictions = this.state.predictions.map((pred, i) => {
        let { className, probability } = pred;
        probability = Math.floor(probability * 10000) / 100 + "%";
        return (
          <div key={ i + "" }>{ i+1 }. Prediction: { className } at { probability } </div>
        )
      })

    }

    return (

      <div className="App">
      <h1>Image classification with ML5.js</h1>
      <img src={ img } id="image" width="400" alt="" />
      { predictions }
      </div>
    );
  }
}

export default App;
