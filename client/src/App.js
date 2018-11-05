import React, { Component } from 'react';
import './App.css';
import img from "./img.jpg";
import * as ml5 from "ml5";


class App extends Component {
  state = {
    predictions: [],
    responseImg: "",
    responseTxts: ""

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

    fetch('/api/img')
    .then((res) => { return res.json(); })
    .then((responseJson) => {
      const arrayOfLinks = responseJson.express;
      this.setState({
        responseImg: arrayOfLinks
      })
    });
    fetch('/api/words')
    .then((res) => { return res.json(); })
    .then((responseJson) => {
      const arrayOfWords = responseJson.express;
      this.setState({
        responseTxts: arrayOfWords
      })
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
        const mostAccurate =  this.state.predictions[0]["className"];
        console.log(mostAccurate, "-------");
        this.sendDataBackToServer(mostAccurate);
        console.log("predictions sent to the server");

        const imgs = this.state.responseImg.map((ele, index) => {
            return (
              <img src={ele} key={index} />
            )
          })
        const txts = this.state.responseTxts.map((ele, index) => {
            return (
              <span key={index}>{ele} </span>
            )
          })

       return (
         <div className="main">
            <section className="left_side">
              {imgs}
            </section>
            <section className="right_side">
              {txts}
            </section>
         </div>
       )
      }
  }
}

export default App;
