import { useEffect, useRef, useState } from 'react';
import { Routes, Route } from "react-router-dom"
import axios from 'axios';
import Header from '../Header';
import Articles from '../Articles';
import './styles.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route exact path="*" element={<Articles />} />
        {/* <Route path="/about" component={<About />} /> */}
      </Routes>
    </div>
  );
}

export default App;
