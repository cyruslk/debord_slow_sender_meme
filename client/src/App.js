import React, { Component } from 'react';
import './App.css';
import img from "./img.jpg";
import * as ml5 from "ml5";

class App extends Component {

  constructor(props) {
   super(props);
   this.state = {
     prediction: ""
   };
  }
  classifyImg = () => {
    const classifier = ml5.imageClassifier('MobileNet', modelLoaded);
    function modelLoaded() {
      console.log('Model Loaded!');
    }
    const image = document.getElementById('image');
    classifier.predict(image, 5, function(err, results) {
      // Here post in the fs the word
      console.log(results);

    })
  }

  componentDidMount(){
    this.classifyImg();
  }

  render() {
    return (
      <div className="App">
        <img src={ img } id="image" style={{display: "none"}} alt="" />
      </div>
    );
  }
}

export default App;
