import React, { Component } from "react";
import Header from "./../components/header";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
} from "reactstrap";
import axios from "axios";
import { API_URL } from "./../helper";
import { currencyFormatter } from "../helper/currency";
import { Link } from "react-router-dom";

class Home extends Component {
  state = {
    data: [],
    qty: 1,
  };

  componentDidMount() {
    axios
      .get(`${API_URL}/products`)
      .then((res) => {
        this.setState({ data: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onQtyClick = (operator) => {
    if (operator === "tambah") {
      this.setState({ qty: this.state.qty + 1 });
    } else {
      var hasil = this.state.qty - 1;
      if (hasil < 1) {
        alert("gak boleh kurang");
      } else {
        this.setState({ qty: this.state.qty - 1 });
      }
    }
  };

  renderProduct = () => {
    return this.state.data.map((val, index) => {
      return (
        <div key={index} className="col-md-3">
          <Card width="150vh">
            <CardImg
              top
              width="150vh"
              src={val.img}
              alt="Card image cap"
              height="200vh"
            />
            <CardBody>
              <CardTitle tag="h5">{val.name}</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                {currencyFormatter(val.price * this.state.qty)}
              </CardSubtitle>
              <CardSubtitle
                className="mt-1 mb-1"
                style={{ fontWeight: "bold" }}
              >
                Jumlah Stock: {val.stock}
              </CardSubtitle>
              <CardSubtitle className="mt-2">{val.description}</CardSubtitle>
              <Link
                to={{ pathname: `/product/${val.id}`, state: { product: val } }}
              >
                <Button
                  className="w-100 py-2"
                  style={{ backgroundColor: "#003142" }}
                >
                  Details
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      );
    });
  };

  render() {
    return (
      <div>
        <Header />
        <div>
          <section className="container">
            <div className="row mt-3">{this.renderProduct()}</div>
          </section>
        </div>
      </div>
    );
  }
}

export default Home;
