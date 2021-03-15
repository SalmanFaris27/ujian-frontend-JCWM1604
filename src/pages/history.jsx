import React, { Component } from "react";
import axios from "axios";
import Header from "./../components/header";
import { API_URL } from "./../helper";
import { currencyFormatter } from "./../helper/currency";
import { Table, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";

class History extends Component {
  state = {
    banks: [],
    pilihanId: 0,
    modal: false,
    modalDetail: false,
    bukti: "",
    history: [],
    indexdetail: -1,
  };
  async componentDidMount() {
    try {
      var res1 = await axios.get(
        `${API_URL}/transactions?userId=${this.props.dataUser.id}`
      );

      var res2 = await axios.get(`${API_URL}/products`);
      this.setState({
        history: res1.data,
        products: res2.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  rendertotalDetail = () => {
    let total = 0;

    this.state.history[this.state.indexdetail].products.forEach((val) => {
      total += val.price * val.qty;
    });

    return total;
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  toggledetail = () => {
    this.setState({ modalDetail: !this.state.modalDetail });
  };

  renderdetail = () => {
    var indexdetail = this.state.indexdetail;
    return this.state.history[indexdetail].products.map((val, index) => {
      return (
        <tr key={index}>
          <td>{val.name}</td>
          <td>{currencyFormatter(val.price)}</td>
          <td>{val.qty}</td>
          <td>{currencyFormatter(val.qty * val.price)}</td>
        </tr>
      );
    });
  };

  onDetailClick = (index) => {
    this.setState({ indexdetail: index, modalDetail: true });
  };

  onBatalClick = async (index) => {
    let productsAdmin = this.state.products;
    console.log(productsAdmin);
    let producthistory = this.state.history[index].products;
    try {
      for (let i = 0; i < producthistory.length; i++) {
        for (let j = 0; j < productsAdmin.length; j++) {
          if (producthistory[i].id === productsAdmin[j].id) {
            let stocknew = producthistory[i].qty + productsAdmin[j].stock;
            await axios.patch(`${API_URL}/products/${productsAdmin[j].id}`, {
              stock: stocknew,
            });
          }
        }
      }

      await axios.patch(
        `${API_URL}/transactions/${this.state.history[index].id}`,
        {
          status: "batal",
        }
      );

      var res1 = await axios.get(
        `${API_URL}/transactions?userId=${this.props.dataUser.id}`
      );
      this.setState({ history: res1.data });
      toast("berhasil dibatalkan!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
      alert("server");
    }
  };

  renderHistory = () => {
    return this.state.history.map((val, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{val.tanggal}</td>
          <td>{val.status}</td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => this.onBatalClick(index)}
              disabled={val.status === "batal"}
              style={{ backgroundColor: "#003142", color: "white" }}
            >
              Batal
            </button>
          </td>
          <td>
            <button
              className="btn btn-primary"
              onClick={() => this.onDetailClick(index)}
              disabled={val.status === "batal"}
              style={{ backgroundColor: "#003142", color: "white" }}
            >
              Detail
            </button>
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div>
        {this.state.indexdetail < 0 ? null : (
          <Modal
            size="lg"
            centered
            isOpen={this.state.modalDetail}
            toggle={this.toggledetail}
          >
            <ModalHeader toggle={this.toggledetail}>
              Detail transaksi
            </ModalHeader>
            <ModalBody>
              <Table>
                <thead>
                  <tr>
                    <th>nama</th>
                    <th>harga</th>
                    <th>qty</th>
                    <th>subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderdetail()}
                  <tr>
                    <th></th>
                    <th></th>
                    <th>Total</th>
                    <th>{currencyFormatter(this.rendertotalDetail())}</th>
                  </tr>
                </tbody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <button
                className="btn btn-success"
                style={{ backgroundColor: "#003142", color: "white" }}
              >
                Bayar
              </button>
              <button
                onClick={this.toggledetail}
                className="btn btn-primary"
                style={{ backgroundColor: "#003142", color: "white" }}
              >
                tutup
              </button>
            </ModalFooter>
          </Modal>
        )}

        <Header />
        <div className="container mt-5">
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Tanggal</th>
                <th>status</th>
                <th>batal</th>
                <th>detail</th>
              </tr>
            </thead>
            <tbody>{this.renderHistory()}</tbody>
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
export default connect(MaptstatetoProps)(History);
