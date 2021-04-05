import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { Col, ListGroup, Row, Image } from 'react-bootstrap';


function OrderScreen() {

  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;
  const { totalPrice } = cart;


  const dispatch = useDispatch();

  const createOrder = useSelector(state => state.createOrder);
  const { order, success, error } = createOrder;

  return (
    <>
      <Meta />
      <CheckoutSteps step1 step2 step3 step4 />
      {success && (<>
        <h2 class="my-3"> Success</h2>
        <p class="my-4"> Your order has been placed and is set to be shipped at {order.createdOrder.shippingAddress.address} {order.createdOrder.shippingAddress.city} {order.createdOrder.shippingAddress.postalCode} {order.createdOrder.shippingAddress.country}  </p>
        {/* <ListGroup variant="flush">
        {order.createdOrder.orderItems.map((item, index) => (
          <ListGroup.Item key={index}>
            <Row>
              <Col md={1}>
                 <Image src={item.image} alt={item.name} fluid rounded />
              </Col>
              <Col>
                <Link to={`/product/${item.product}`}>
                  {item.name}
                </Link>
              </Col>
              <Col>
                {item.qty} X 
                </Col>
            </Row>
          </ListGroup.Item>
        ))}
          </ListGroup> */}
        <p class="my-3 success-order-text"> You can check the list of your orders in your profile. <Link to="/profile"> Click here </Link> to visit your profile.  </p>
        </>
        )}
        {error && (<Message variant="danger"> {error}  </Message>)}
      </>
  )
}

export default OrderScreen;
