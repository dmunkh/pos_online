import {
  getPlaces,
  insertPlace,
  deletePlace,
  insertCompany,
  getCompany,
  getBaraa,
  getStore,
  getOrder,
} from "../helpers/db";

export const COMPANY_ADD = "COMPANY_ADD";
export const LOAD_COMPANY = "LOAD_COMPANY";
export const LOAD_BARAA = "LOAD_BARAA";
export const LOAD_STORE = "LOAD_STORE";
export const LOAD_ORDER = "LOAD_ORDER";

export const DELETE_PLACE = "DELETE_PLACE";
export const ADD_PLACE = "ADD_PLACE";
export const LOAD_PLACES = "LOAD_PLACES";

export const loadCompany = () => {
  return async (dispatch) => {
    // sqlite базаас уншилт хийх хэсэг
    const dbResult = await getCompany();
    const rows = dbResult.rows._array;

    dispatch({
      type: LOAD_COMPANY,
      data: rows,
    });
  };
};

export const loadBaraa = () => {
  return async (dispatch) => {
    // sqlite базаас уншилт хийх хэсэг
    const dbResult = await getBaraa();
    const rows = dbResult.rows._array;

    dispatch({
      type: LOAD_BARAA,
      data: rows,
    });
  };
};

export const loadStore = () => {
  return async (dispatch) => {
    // sqlite базаас уншилт хийх хэсэг
    const dbResult = await getStore();
    const rows = dbResult.rows._array;

    dispatch({
      type: LOAD_STORE,
      data: rows,
    });
  };
};

export const loadOrder = () => {
  return async (dispatch) => {
    // sqlite базаас уншилт хийх хэсэг
    const dbResult = await getOrder();
    const rows = dbResult.rows._array;

    dispatch({
      type: LOAD_ORDER,
      data: rows,
    });
  };
};

export const removePlace = (placeId) => {
  return async (dispatch) => {
    // sqlite базаас устгах хэсэг
    await deletePlace(placeId);

    dispatch({
      type: DELETE_PLACE,
      data: {
        id: placeId,
      },
    });
  };
};

export const addPlace = (placeName, imageUri, location) => {
  return async (dispatch) => {
    // Эхлээд дэлгэрэнгүй хаягийг олцгооё
    const result = await fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        location.lat +
        "," +
        location.lng +
        "&key=" +
        ENV.googleMapApiKey
    );

    let address;
    if (result.ok) {
      const data = await result.json();
      address = data.results[0].formatted_address;
    } else {
      address = "Хаягийг авч чадсангүй";
    }

    // sqlite баз руу бичилт хийх хэсэг
    const newPlaceObj = await insertPlace(
      placeName,
      imageUri,
      address,
      location.lat,
      location.lng
    );

    dispatch({
      type: ADD_PLACE,
      data: {
        id: newPlaceObj.insertId,
        title: placeName,
        imageUri,
        lat: location.lat,
        lng: location.lng,
        address,
      },
    });
  };
};

export const loadPlaces = () => {
  return async (dispatch) => {
    // sqlite базаас уншилт хийх хэсэг
    const dbResult = await getPlaces();
    const rows = dbResult.rows._array;

    dispatch({
      type: LOAD_PLACES,
      data: rows,
    });
  };
};
