import React, { Component } from 'react';

import logo from './logo.svg';

import './App.css';

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    if(this.state.response.length === 0){
      return (
        <div>
          LOADING
        </div>
      )
    }else{
      const imgs = this.state.response.map((ele, index) => {
        return (
          <img src={ele} key={index} />
        )
      })
      return (
        <div>
            {imgs}
        </div>
      )
    }

  }
}

export default App;
