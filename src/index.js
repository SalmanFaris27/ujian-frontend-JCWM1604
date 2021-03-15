import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Provider} from "react-redux"
import {applyMiddleware, createStore} from "redux"
import reducers from "./redux/reducers"
import Thunk from "redux-thunk"

const store = createStore (reducers, applyMiddleware(Thunk))

ReactDOM.render(
  <Provider store = {store}>


  <BrowserRouter>
  <App />
  </BrowserRouter>

  </Provider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

