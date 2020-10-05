import React from 'react';
import Main from "./Components/MainComponent";
import ScrollToTop from "./Components/ScrollToTop";
import { BrowserRouter } from 'react-router-dom';
// import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ScrollToTop />
        <Main />
      </div>
    </BrowserRouter>
  );
}

export default App;
