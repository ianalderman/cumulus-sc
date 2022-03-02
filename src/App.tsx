import React from 'react';
import { BrowserRouter, Routes, Route }from "react-router-dom";


import logo from './logo.svg';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCube, faCubes,faFolder,faFileCode, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import SCBrowser from './SCBrowser';

library.add(faCube,faCubes,faFolder,faFileCode,faExclamationTriangle)

/*function App() {
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
}*/

function App() {
  //const search = useLocation().search
  //let searchParams = new URLSearchParams(search).get('catalogPath');
  //let params = new URLSearchParams(search)
  //const searchParamsContext = React.createContext({searchParams: params})
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SCBrowser />}>
          <Route path=":catalogPath/*" element={<SCBrowser />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
