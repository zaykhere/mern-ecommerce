import React, { useState } from 'react';
import { Row,Col, Button, ListGroup, Image, Card} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import { Link } from 'react-router-dom';
import StripeContainer from './StripeContainer';
import Meta from '../components/Meta';

function PaymentScreen({ history }) {

  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;
  const { totalPrice } = cart;

  const [showForm, setShowForm] = useState(false);

  if (!shippingAddress) {
    history.push('/shipping');
  }
 
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    setShowForm(true);
    
   
  }


  return (
    <>
        <Meta />
        <CheckoutSteps step1 step2 step3 />
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Shipping </h2>
                <p>
                  <strong>Address:</strong>
                  {cart.shippingAddress.address} , {cart.shippingAddress.city}, {cart.shippingAddress.state}, {cart.shippingAddress.country}
                </p>
              </ListGroup.Item>
              <ListGroup.Item>
                <h2> Order Items</h2>
                {cart.cartItems.length === 0 ? <Message> Your cart is empty</Message> : (
                  <ListGroup variant="flush">
                    {cart.cartItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1} >
                            <Image src={item.image} alt={item.name} fluid rounded />
                            {console.log(item.image)}
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col>
                            {item.qty} X ${item.price} = ${item.qty*item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
        </Col>
        <Col md={12}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <h2> Price </h2>
                    <p> ${cart.totalPrice} </p>
                    {showForm ? <StripeContainer /> : <> <h3> {totalPrice} </h3> <Button onClick={submitHandler}> Place Order</Button> </> }
                  </Col>
                </Row>
                <Row>

                </Row>
              </ListGroup.Item>
            </ListGroup>
            </Card>
        </Col>
        </Row>
     
    </>
  )
}

export default PaymentScreen
