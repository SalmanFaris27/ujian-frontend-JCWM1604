const INITIAL_STATE = {
  id: 0,
  email: "",
  password: "",
  isLogin: false,
  cart: [],
};

const AuthReducers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, ...action.payload, isLogin: true };
    case "LOGOUT":
      return INITIAL_STATE;
    case "UPDATECART":
      return { ...state, cart: action.cart };

    default:
      return state;
  }
};

export default AuthReducers;
