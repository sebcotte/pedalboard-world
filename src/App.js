import React, { Component } from 'react';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Pedalboard World</h1>
        <Button>Clique sur moi!</Button>
      </div>
    );
  }
}
export default App;
