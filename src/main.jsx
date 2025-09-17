import React from 'react'
import ReactDOM from 'react-dom/client'
<<<<<<< HEAD
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
=======
import {BrowserRouter, Routes, Route} from "react-router-dom";
import App from './App.jsx'
import Carrito from './pages/Carrito.jsx';
import Pago from './pages/Pago.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}/>
      <Route path='/Carrito' element={<Carrito />}/>
      <Route path='/pago' element={<Pago />} />
    </Routes>
    </BrowserRouter>
>>>>>>> amigo/master
  </React.StrictMode>
)