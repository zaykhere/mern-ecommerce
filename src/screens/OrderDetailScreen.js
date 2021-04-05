import React, {useState, useEffect} from 'react';
import axios from "axios";
import Message from '../components/Message';
import { ListGroup, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';
import {api} from '../api';

function OrderDetailScreen(props) {

  const [order, setOrder] = useState([]);
  const [error, setError] = useState(null);

  const str = 'pakistan';

  useEffect(() => {
    async function getOrder() {
      try {
        const {data} = await axios.get(`${api}/api/orders/${props.match.params.id}`);
      if (data.error) {
        setError(data.error);
      }

        if (data.order) {
        setOrder(data.order);
      }
      }
      catch (error) {
        setError(error.message);
      }
      
    }

    getOrder();

  }, [props.match.params.id])

  return (
    <>
      <Meta />
      {error && (<Message variant='danger'> {error} </Message>)}
      <h2 className="my-3"> Order Details</h2>
      <p> The order details for the order with the ID <strong> {props.match.params.id}</strong>  are:</p>
      {order.length > 0 && order.map(order => (
         <ListGroup variant="flush">
          {console.log("order", order)}
          {console.log("id", order._id)}
          <ListGroup.Item> Order ID: {order._id}  </ListGroup.Item>
          <ListGroup.Item> Shipping Address: {order.shippingAddress.address} {order.shippingAddress.city} {order.shippingAddress.country} {order.shippingAddress.postalCode}  </ListGroup.Item>
          {order.orderItems.map(item => (
            <ListGroup.Item key={item._id}>
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
                    {item.qty} X ${item.price} = ${item.qty*item.price}
                 </Col>
              </Row>
            </ListGroup.Item>
          ))}
          <ListGroup.Item>Total Price: {order.totalPrice}</ListGroup.Item>
          <ListGroup.Item> Delivered Status? {order.isDelivered ? "True" : "False"} </ListGroup.Item>
          <ListGroup.Item> Ordered At: {order.createdAt.substring(0,10)}</ListGroup.Item>
        </ListGroup>
      ))}
       
      
    </>
  )
}

export default OrderDetailScreen
