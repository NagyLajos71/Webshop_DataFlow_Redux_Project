import React from 'react';
import './App.css';
import WebShop from './components/WebShop';
import Kosar from './components/Kosar';
import Raktar from './components/Raktar';

function App() {
  return (
    <div className="App">
      <Raktar/>
      <WebShop/>
      <Kosar/>  
    </div>
  );
}

export default App;
