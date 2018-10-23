import { TEST_DISPATCH } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TEST_DISPATCH:
      return {
        ...state,
        user: action.payload //duplicate key in a hash uses last assigned value so user key
        // from initialstate sill be overridden
      };
    default:
      return state;
  }
}
