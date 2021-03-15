import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "reactstrap";
import "./header.css";
import { GiSonicShoes, GiShoppingCart } from "react-icons/gi";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { LogoutAction } from "./../redux/actions";
import { toast } from "react-toastify";

class Header extends Component {
  state = {
    isOpen: false,
  };
  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  onLogoutClick = () => {
    localStorage.removeItem("id");
    this.props.LogoutAction();
    toast("berhasil logout!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  render() {
    return (
      <div>
        <Navbar className="bg-light px-5 shadow " light expand="md">
          <NavbarBrand href="/">
            <span
              className="font-weight-bold header-brand"
              style={{ color: "#003142" }}
            >
              <GiSonicShoes /> BRODO
            </span>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {this.props.dataUser.isLogin ? (
                <>
                  <Link to="/history">
                    <NavItem className="py-2 mx-2" style={{ color: "#003142" }}>
                      History
                    </NavItem>
                  </Link>
                  <NavItem className="py-2 mx-2">
                    <Link to="/cart">
                      <GiShoppingCart
                        style={({ fontSize: "25px" }, { color: "#003142" })}
                      />
                    </Link>
                    {this.props.dataUser.cart.length ? (
                      <Badge
                        style={{
                          position: "relative",
                          bottom: 10,
                          right: 5,
                          backgroundColor: "#003142",
                        }}
                        className="px-1 rounded-circle text-center"
                      >
                        {this.props.dataUser.cart.length}
                      </Badge>
                    ) : null}
                  </NavItem>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav>
                      {this.props.dataUser.email}
                    </DropdownToggle>
                    <DropdownMenu right>
                      <Link to="/">
                        <DropdownItem onClick={this.onLogoutClick}>
                          LogOut
                        </DropdownItem>
                      </Link>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </>
              ) : (
                <>
                  <NavItem className="mx-2">
                    <Link to="/login">
                      <button
                        className=" header-bg rounded px-4 py-2 font-weight-bold"
                        style={{ color: "white" }}
                      >
                        Login
                      </button>
                    </Link>
                  </NavItem>
                </>
              )}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const MaptstatetoProps = (state) => {
  return {
    dataUser: state.Auth,
  };
};

export default connect(MaptstatetoProps, { LogoutAction })(Header);
