import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "./../components/header";
import Axios from "axios";
import { InputGroup, Input, InputGroupText } from "reactstrap";
import { API_URL } from "./../helper";
import { LoginAction } from "./../redux/actions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";

import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

import FormControl from "@material-ui/core/FormControl";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { toast } from "react-toastify";

const Style = {
  root: {
    "& label.Mui-focused": {
      color: "#003142",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#003142",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#003142",
      },
      "&:hover fieldset": {
        borderColor: "#003142",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#003142",
      },
    },
  },
};

class Login extends Component {
  state = {
    email: "",
    password: "",
    isVisible: false,
  };

  toggle = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onLoginSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.email);
    const { email, password } = this.state;
    let data = {
      email,
      password,
      cart: [],
    };
    Axios.get(`${API_URL}/users?email=${email}&password=${password}`)
      .then((res) => {
        if (!this.state.password.match(/^(?=.*[0-9])(?=.{6,100})/)) {
          toast("login error!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          if (res.data.length) {
            localStorage.setItem("id", res.data[0].id);
            this.props.LoginAction(res.data[0]);
          } else {
            Axios.post(`${API_URL}/users`, data)
              .then((res2) => {
                localStorage.setItem("id", res2.data.id);
                this.props.LoginAction(res2.data);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { classes } = this.props;
    if (this.props.dataUser.isLogin) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Header />
        <div className="container mt-4 py-4">
          <div className="row" style={{ height: "50vh" }}>
            <div className="col-md-7">
              <img
                src="https://cdn.shopify.com/s/files/1/0256/2398/6281/files/17_1600x.png?v=1606205248"
                width="100%"
              />
            </div>
            <div className="rounded col-md-5 d-flex justify-content-center pt-5 shadow">
              <form onSubmit={this.onLoginSubmit} style={{ width: "50%" }}>
                <h1 style={{ fontWeight: "bold" }}>Login</h1>
                <input
                  type="text"
                  placeholder="email"
                  className="form-control my-2"
                  name="email"
                  onChange={this.onInputChange}
                  value={this.state.email}
                />

                <FormControl variant="outlined" className={classes.root}>
                  <InputLabel className="warna">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={this.state.isVisible ? "text" : "password"}
                    value={this.state.password}
                    onChange={this.onInputChange}
                    name="password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.toggle}
                        >
                          {this.state.isVisible ? (
                            <AiFillEye style={{ color: "#003142" }} />
                          ) : (
                            <AiFillEyeInvisible style={{ color: "#9f9f9f" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={70}
                  />
                </FormControl>

                <button
                  className="mt-2 btn"
                  style={{ backgroundColor: "#003142", color: "white" }}
                  submit={true ? "submit" : "button"}
                >
                  Login
                </button>
                <br></br>
                <p className="mt-4" style={{ fontStyle: "italic" }}>
                  *password minimal 6 karakter
                </p>
                <p style={{ fontStyle: "italic" }}>*harus ada angkanya</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const MaptstatetoProps = (state) => {
  return {
    dataUser: state.Auth,
  };
};

export default withStyles(Style)(
  connect(MaptstatetoProps, {
    LoginAction,
  })(Login)
);
