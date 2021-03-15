import React, { Component } from "react";
import Header from "./../components/header";
import { Table, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import { API_URL } from "./../helper";
import { currencyFormatter } from "./../helper/currency";
import axios from "axios";
import { CartAction } from "./../redux/actions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";

const Myswal = withReactContent(Swal);

class Cart extends Component {
  state = {
    modal: false,
    stockuser: [],
    loading: true,
  };

  componentDidMount() {
    var arr = [];
    var cart = this.props.dataUser.cart;
    cart.forEach((val) => {
      arr.push(axios.get(`${API_URL}/products/${val.id}`));
    });
    console.log(cart, "32");
    Promise.all(arr)
      .then((res) => {
        console.log(res);
        var newarr = [];
        res.forEach((val) => {
          newarr.push({ id: val.data.id, stockuser: val.data.stock });
        });
        console.log(newarr);
        this.setState({ stockuser: newarr });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  onMinusClick = (index) => {
    let cart = this.props.dataUser.cart;
    let hasil = cart[index].qty - 1;
    if (hasil < 1) {
      toast.warn("delete saja kalo pengen 0!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      cart[index].qty = cart[index].qty - 1;
      let iduser = this.props.dataUser.id;
      axios
        .patch(`${API_URL}/users/${iduser}`, { cart: cart })
        .then((res) => {
          this.props.CartAction(res.data.cart);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  onPlusClick = (index) => {
    let cart = this.props.dataUser.cart;
    let idprod = cart[index].id;
    axios
      .get(`${API_URL}/products/${idprod}`)
      .then((res) => {
        let stock = res.data.stock;
        let qty = cart[index].qty;
        let hasil = qty + 1;
        if (hasil > stock) {
          toast.warn("qty melebihi stock!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          cart[index].qty = hasil;
          let iduser = this.props.dataUser.id;
          axios
            .patch(`${API_URL}/users/${iduser}`, { cart: cart })
            .then((res) => {
              this.props.CartAction(res.data.cart);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onDeleteClick = (index) => {
    let cart = this.props.dataUser.cart;

    Myswal.fire({
      title: `Yakin gak jadi beli ${cart[index].name} ?`,
      text: "kalo mau beli tambah lagi ke cart ya!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#003142",
      cancelButtonColor: "#003142",
      confirmButtonText: "Delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        cart.splice(index, 1);
        let iduser = this.props.dataUser.id;

        axios
          .patch(`${API_URL}/users/${iduser}`, { cart: cart })
          .then((res) => {
            this.props.CartAction(res.data.cart);
            Myswal.fire("Deleted!", "Your Cart has been deleted.", "success");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  renderCart = () => {
    return this.props.dataUser.cart.map((val, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{val.brand}</td>
          <td>
            <img src={val.img} alt={val.name} width="200px" height="150px" />
          </td>
          <td>{currencyFormatter(val.price)}</td>
          <td>
            <button
              className="btn btn-danger mx-2"
              onClick={() => this.onMinusClick(index)}
              style={{ backgroundColor: "#003142", color: "white" }}
            >
              -
            </button>
            {val.qty}
            <button
              className="btn btn-success mx-2"
              onClick={() => this.onPlusClick(index)}
              style={{ backgroundColor: "#003142", color: "white" }}
            >
              +
            </button>
          </td>
          <td>{currencyFormatter(val.price * val.qty)}</td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => this.onDeleteClick(index)}
              style={{ backgroundColor: "#003142", color: "white" }}
            >
              delete
            </button>
          </td>
        </tr>
      );
    });
  };

  onCheckoutClick = () => {
    console.log(this.state);
    let iduser = this.props.dataUser.id;
    let data = {
      userId: this.props.dataUser.id,
      tanggal: new Date(),
      status: "belum bayar",
      products: this.props.dataUser.cart,
    };

    axios
      .post(`${API_URL}/transactions`, data)
      .then(() => {
        axios
          .patch(`${API_URL}/users/${iduser}`, { cart: [] })
          .then((res1) => {
            var stockuser = this.state.stockuser;
            var cart = this.props.dataUser.cart;
            var stockfetch = stockuser.map((val, index) => {
              let stockakhir = val.stockuser - cart[index].qty;
              return axios.patch(`${API_URL}/products/${val.id}`, {
                stock: stockakhir,
              });
            });
            Promise.all(stockfetch)
              .then(() => {
                this.props.CartAction(res1.data.cart);
                this.setState({ modal: false });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  rendertotal = () => {
    let total = 0;
    this.props.dataUser.cart.forEach((val) => {
      total += val.price * val.qty;
    });
    return total;
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  onInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div>
        <Modal centered isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Checkout</ModalHeader>
          <ModalBody>Are You Sure Wanna Checkout ?</ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={this.onCheckoutClick}
              style={{ backgroundColor: "#003142", color: "white" }}
            >
              checkout
            </button>
            <button
              className="btn"
              onClick={this.toggle}
              style={{ backgroundColor: "#003142", color: "white" }}
            >
              Cancel
            </button>
          </ModalFooter>
        </Modal>
        <Header />
        <div className="container mt-5">
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama</th>
                <th>Image</th>
                <th>Harga</th>
                <th>qty</th>
                <th>subtotal</th>
                <th>delete</th>
              </tr>
            </thead>
            <tbody>
              {this.renderCart()}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>Total</td>
                <td>{currencyFormatter(this.rendertotal())} </td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => this.setState({ modal: true })}
                    style={{ backgroundColor: "#003142", color: "white" }}
                  >
                    checkout
                  </button>
                </td>
              </tr>
            </tbody>
          </Table>
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

export default connect(MaptstatetoProps, { CartAction })(Cart);
