import React from 'react';
import logo from './logo.svg';
import './App.css';
import SCBrowser from './SCBrowser';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
          Environment: {process.env.REACT_APP_MY_ENV}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <SCBrowser/>
    </div>
  );
}

export default App;
