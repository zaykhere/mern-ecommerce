import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS, SAVE_TOTAL_PRICE } from '../constants/cartConstants';

export const cartReducer = (state = { cartItems: [], shippingAddress: {}, totalPrice:{} }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existItem = state.cartItems.find(i => i.product === item.product);
      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(i=> i.product === existItem.product ? item : i)
        }
      }
      else {
        return {
          ...state,
          cartItems: [...state.cartItems, item]
        }
      }

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(x => x.product !== action.payload)
      }
    
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload
      }
    
    case SAVE_TOTAL_PRICE:
      return {
        ...state,
        totalPrice: action.payload
      }
      
    default:
      return state;
  }
}
