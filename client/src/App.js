import React, { Component } from 'react';
import './App.css';
import img from "./img.jpg";
import * as ml5 from "ml5";


class App extends Component {
  state = {
    predictions: []  // Set the empty array predictions state
  }

  setPredictions = (pred) => {
    this.setState({
      predictions: pred,
      response: ""
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

    fetch('/api/img')
    .then((res) => { return res.json(); })
    .then((responseJson) => {
      console.log(responseJson, "----");
    });
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
      if(this.state.predictions.length === 0){
        return (
          <div className="words">
          <img src={ img } id="image" style={{display: "none"}} alt="" />
            loading
          </div>
        )
      }else{
        console.log(this.state.predictions);
        const mostAccurate =  this.state.predictions[0]["className"];
        // console.log(mostAccurate);
        this.sendDataBackToServer(mostAccurate);
        console.log(this.state.response, "----");
       //  const imgs = this.state.response.map((ele, index) => {
       //   return (
       //     <img src={ele} key={index} />
       //   )
       // })
       return (
         <div>
            sent
         </div>
       )
      }
  }
}

export default App;
