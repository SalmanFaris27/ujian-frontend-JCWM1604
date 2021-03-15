import React, { Component } from "react";
import Header from "../components/header";
import axios from "axios";
import { API_URL } from "./../helper";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { CartAction } from "../redux/actions/AuthActions";
import { currencyFormatter } from "./../helper/currency";
import { toast } from "react-toastify";

class ProductDetail extends Component {
  state = {
    product: {},
    loading: true,
    qty: 1,
  };

  componentDidMount() {
    var idprod = this.props.match.params.idprod;
    var data = this.props.location.state;
    if (!data) {
      axios
        .get(`${API_URL}/products/${idprod}?_expand=category`)
        .then((res) => {
          this.setState({ product: res.data });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ product: data.product, loading: false });
    }
  }

  onQtyClick = (operator) => {
    if (operator === "tambah") {
      var hasil = this.state.qty + 1;
      if (hasil > this.state.product.stock) {
        toast.success("melebihi stock!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        this.setState({ qty: this.state.qty + 1 });
      }
    } else {
      var hasil = this.state.qty - 1;
      if (hasil < 1) {
        toast.success("nggak boleh kurang dari satu!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        this.setState({ qty: this.state.qty - 1 });
      }
    }
  };

  onAddToCartClick = () => {
    if (this.props.dataUser.isLogin === false) {
      toast.warn("login dulu bos!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      let id = this.props.dataUser.id;
      let idprod = this.state.product.id;
      let stock = this.state.product.stock;
      axios
        .get(`${API_URL}/users/${id}`)
        .then((res) => {
          var cart = res.data.cart;

          let findIdx = cart.findIndex((val) => val.id == idprod);
          if (findIdx < 0) {
            let data = {
              ...this.state.product,
              qty: this.state.qty,
            };

            cart.push(data);

            axios
              .patch(`${API_URL}/users/${id}`, { cart: cart })
              .then((res1) => {
                this.props.CartAction(res1.data.cart);
                toast.warn("berhasil ditambahkan ke cart", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            let qtyakhir = cart[findIdx].qty + this.state.qty;
            if (qtyakhir > stock) {
              var qtyablebuy = stock - cart[findIdx].qty;
              toast.info(
                "barang dicart melebihi stock, barang yang bisa dibeli hanya " +
                  qtyablebuy,
                {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                }
              );
            } else {
              cart[findIdx].qty = qtyakhir;
              axios
                .patch(`${API_URL}/users/${id}`, { cart: cart })
                .then((res1) => {
                  console.log(res1.data);
                  this.props.CartAction(res1.data.cart);
                  toast.success("berhasil ditambahkan ke cart!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
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
    }
  };

  render() {
    return (
      <div>
        <Header />

        <div className="container">
          <div className="bg-transparent">
            <Breadcrumb className="mt-5 bg-transparent">
              <BreadcrumbItem>
                <Link to="/">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>{this.state.product.name}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="row mt-2">
            <div className="col-md-6 shadow">
              <img
                src={this.state.product.img}
                alt="product"
                width="100%"
                height="400vh"
              />
            </div>
            <div className="col-md-6">
              <div className="my-2" style={{ fontSize: "30px" }}>
                {this.state.product.name}
              </div>
              <div
                className="font-weight-bold my-2"
                style={{ fontSize: "35px" }}
              >
                {currencyFormatter(this.state.product.price * this.state.qty)}
              </div>
              <div className="d-flex">
                <button
                  className="py-2 px-2 btn btn-success"
                  style={{
                    fontSize: 35,
                    width: "50px",
                    backgroundColor: "#003142",
                  }}
                  onClick={() => this.onQtyClick("kurang")}
                >
                  -
                </button>
                <div
                  className="w-25 d-flex justify-content-center align-items-center"
                  style={{ fontSize: 35 }}
                >
                  {this.state.qty}
                </div>
                <button
                  className="py-2 px-2 btn btn-success"
                  style={{
                    fontSize: 35,
                    width: "50px",
                    backgroundColor: "#003142",
                  }}
                  onClick={() => this.onQtyClick("tambah")}
                >
                  +
                </button>
              </div>
              <div className="my-3">
                <button
                  className="w-50 py-2 btn btn-success"
                  onClick={this.onAddToCartClick}
                  style={{ backgroundColor: "#003142" }}
                >
                  Add to Cart
                </button>
              </div>
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

export default connect(MaptstatetoProps, { CartAction })(ProductDetail);
