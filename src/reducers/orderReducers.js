import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_RESET
} from "../constants/orderConstants";

export const createOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return {
        loading: true,
      };
    case ORDER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        order: action.payload,
      };

    case ORDER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const orderListReducer = (state = { orders: [] }, action) => {
  switch(action.type) {
    case ORDER_LIST_REQUEST:
      return {
        loading: true
      }
     case ORDER_LIST_SUCCESS:
       return {
         loading: false,
         orders: action.payload
       }
    case ORDER_LIST_FAIL:
     return{ 
      loading: false,
      error: action.payload
     }
    default:
      return state;  
  }
};

export const orderDeliverReducer = (state={} , action) => {
  switch(action.type) {
    case ORDER_DELIVER_REQUEST:
      return {
        loading: true
      }
    case ORDER_DELIVER_SUCCESS:
      return {
        loading: false,
        success: true
      }
    case ORDER_DELIVER_FAIL:
      return {
        loading: false,
        error: action.payload
      }
    case ORDER_DELIVER_RESET:
      return {}
    default:
      return state;        
  }
}
