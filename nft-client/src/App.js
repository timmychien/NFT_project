import React, { useState, useEffect } from "react";
//import { render } from "react-dom";
import { Helmet } from 'react-helmet'
//import logo from './logo.svg';
//import {getData}from './promoteData.js';
import './App.css';
const App=()=>{
  const [pageData, setPageData] = useState({});
  const getPageData = async () => {
    const response = await fetch("http://140.112.107.18:5000");
    const jsonData = await response.json();
    setPageData(jsonData);

  };
  
  useEffect(() => {
    getPageData();
  }, []);
  //console.log(pageData.promote_data)
  /*
  render(()=>{
    return(
      <div className="App">
        <h1>{title}</h1>
      </div>
    );

  });*/
  /*
  return(
    <div className="App">
      <div class="user-container">
        <h5 className="info-item">{pageData.promote_data}</h5>
        <h5 className="info-item">{pageData.symbol}</h5>
        <h5 className="info-item">{pageData}</h5>
      </div>
    </div>
  );
  */
  const { title, promote_data } = pageData;
  return(
    <div className="App">
      <Helmet><title>{title}</title></Helmet>
      <h1>react</h1>
      <div className="container">
        {promote_data?.map((item) => (
          <React.Fragment>
            <img src={item.uri} className="art_works" alt="works" /><br/>
            <label>作品名稱:</label>
            <dd>{item.name}</dd>
            <label>創作者:</label>
            <dd>{item.author}</dd>
            <br/>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
  
}

/*
function App() {
  const [pageData, setPageData] = useState({});
  const getPageData = async () => {
    const response = await fetch("http:/140.112.107.18");
    const jsonData = await response.json();
    setPageData(jsonData);

  };
  useEffect(() => {
    getPageData();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
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
      <div class="user-container">
        <h5 className="info-item">{pageData.topic}</h5>
        <h5 className="info-item">{pageData.name}</h5>
        <h5 className="info-item">{pageData.symbol}</h5>
      </div>
    </div>
  );
}*/
export default App;
