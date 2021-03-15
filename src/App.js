import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/login'
import axios from 'axios'
import {LoginAction} from './redux/actions'
import {connect} from 'react-redux'
import {API_URL} from './helper'
import ProductDetail from "./pages/productdetail"
import Cart from "./pages/cart"
import History from "./pages/history"
import {ToastContainer} from 'react-toastify'

import "react-toastify/dist/ReactToastify.min.css";

class App extends Component {
  state = {  }

componentDidMount(){
  let id=localStorage.getItem("id")
  axios.get(`${API_URL}/users/${id}`)
  .then((res)=>{
    this.props.LoginAction(res.data)
  }).catch((err)=>{
    console.log(err)
  })
}

  render() { 
    return ( 
      <div>

        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/product/:id" component={ProductDetail}/>
          <Route path="/cart" exact component={Cart}/>
          <Route path="/history" exact component={History}/>
          <Route path="/login" exact component={Login}/>
          
        </Switch>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#003142"
              fill-opacity="1"
              d="M0,192L16,208C32,224,64,256,96,229.3C128,203,160,117,192,106.7C224,96,256,160,288,170.7C320,181,352,139,384,154.7C416,171,448,245,480,229.3C512,213,544,107,576,69.3C608,32,640,64,672,101.3C704,139,736,181,768,186.7C800,192,832,160,864,138.7C896,117,928,107,960,133.3C992,160,1024,224,1056,245.3C1088,267,1120,245,1152,197.3C1184,149,1216,75,1248,80C1280,85,1312,171,1344,208C1376,245,1408,235,1424,229.3L1440,224L1440,320L1424,320C1408,320,1376,320,1344,320C1312,320,1280,320,1248,320C1216,320,1184,320,1152,320C1120,320,1088,320,1056,320C1024,320,992,320,960,320C928,320,896,320,864,320C832,320,800,320,768,320C736,320,704,320,672,320C640,320,608,320,576,320C544,320,512,320,480,320C448,320,416,320,384,320C352,320,320,320,288,320C256,320,224,320,192,320C160,320,128,320,96,320C64,320,32,320,16,320L0,320Z"
            ></path>
          </svg>
        <ToastContainer/>
      </div>
       );
  }
}
 
export default connect(null,{LoginAction}) (App)
