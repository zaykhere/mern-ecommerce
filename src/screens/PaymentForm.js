import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { createAnOrder } from '../actions/orderActions';
import { api } from "../api";


const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#c4f0ff",
			color: "#fff",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "#87bbfd" }
		},
		invalid: {
			iconColor: "#ffc7ee",
			color: "#ffc7ee"
		}
	}
}

export default function PaymentForm({history}) {

  const [successful, setSuccessful] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const dispatch = useDispatch();

  const cart = useSelector(state => state.cart);
  const { totalPrice } = cart;
  const { cartItems } = cart;
  const createOrder = useSelector(state => state.createOrder);
  const { order, success, error } = createOrder;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)
    })

  
    const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer sk_test_51HLMIgAe7e74HIRPDjo1yKOqkmb73gSqjikJ8mYvZpZznbevKKJnp1Vz0cwPv7SPV8WuaphUhC4zVP8saPtATJR3003kCPtoVs`,
        },
      };
  
    if (!error) {
      try {
            const {id} = paymentMethod
        const response = await axios.post(`${api}/payment`, {
          amount: totalPrice * 100,
          id: id
        }, config);
        
            if (response.data.success) {
              console.log("Successful payment");
              setSuccessful(true);
              dispatch(createAnOrder({
              orderItems: cart.cartItems,
              shippingAddress: cart.shippingAddress,
              totalPrice: totalPrice,

    }))
        }
            
        
      } catch (error) {
        console.log(error);
      }
    }
    else {
      console.log(error.message);
    }
  }

  return (
    <>
        {!successful ? 
        <form onSubmit={handleSubmit}>
            <fieldset className="FormGroup">
                <div className="FormRow">
                    <CardElement options={CARD_OPTIONS}/>
                </div>
            </fieldset>
            <Button type="submit">Pay</Button>
        </form>
        : 
        <Redirect to="/placeorder" />
          
        }
            
        </>
  )

}
