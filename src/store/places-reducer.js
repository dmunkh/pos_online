import {
  ADD_PLACE,
  LOAD_PLACES,
  DELETE_PLACE,
  ADD_COMPANY,
  LOAD_COMPANY,
  LOAD_BARAA,
  LOAD_STORE,
  LOAD_ORDER,
} from "./places-actions";

const initialState = {
  places: [],
  company: [],
  baraa: [],
  store: [],
  order: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_COMPANY: {
      return {
        company: state.company.concat(action.data),
      };
    }
    case LOAD_COMPANY: {
      return {
        company: action.data,
      };
    }
    case LOAD_BARAA: {
      return {
        baraa: action.data,
      };
    }

    case LOAD_STORE: {
      return {
        store: action.data,
      };
    }

    case LOAD_ORDER: {
      return {
        order: action.data,
      };
    }

    case ADD_PLACE: {
      return {
        places: state.places.concat(action.data),
      };
    }
    case LOAD_PLACES: {
      return {
        places: action.data,
      };
    }
    case DELETE_PLACE: {
      const newArr = state.places.filter((el) => el.id !== action.data.id);
      return {
        places: newArr,
      };
    }
    default:
      return state;
  }
};
