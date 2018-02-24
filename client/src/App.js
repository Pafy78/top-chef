import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount() {
    this.callApi()
    .then(res => this.setState({ response: res }))
    .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/top-chef');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    if(this.state.response[0] !== undefined){
      console.log(this.state.response[0]);
      return (
        <div className="App">
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to Top Chef dictionnary</h1>
        </header>
        <h1>List of restaurant with promotion :</h1>
        <div className="restaurant-list">
        {this.state.response.sort(function(a,b){return parseInt(b.discount_amount)  - parseInt(a.discount_amount);}).map((restaurant, index) => (
          <div className="card">
          <a target="_blank" href={"https://www.lafourchette.com" + restaurant.fourchette_url}>
          <div className="restaurant">
          <div>
          <h2>{restaurant.title}</h2>
          <p className="little promo">{restaurant.promotion}</p>
          </div>
          <div>
          <p>{restaurant.adress}</p>
          <p>{restaurant.locality}, {restaurant.postalcode}</p>
          </div>
          </div>
          </a>
          </div>
        ))}
        </div>
        </div>
      );
    }
    else{
      return (
        <div className="App">
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to Top Chef dictionnary</h1>
        </header>
        <p>Loading restaurants ...</p>
        </div>
      );
    }

  }
}

export default App;
