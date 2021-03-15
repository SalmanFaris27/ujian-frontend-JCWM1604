export const LoginAction = (input) => {
  return {
    type: "LOGIN",
    payload: input,
  };
};

export const CartAction = (input) => {
  return {
    type: "UPDATECART",
    cart: input,
  };
};

export const LogoutAction = () => {
  return {
    type: "LOGOUT",
  };
};
