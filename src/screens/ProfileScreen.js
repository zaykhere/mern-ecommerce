import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import axios from "axios";
import { LinkContainer } from 'react-router-bootstrap';
import Meta from '../components/Meta';
import { api } from '../api';

function ProfileScreen({location,history}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const [buttonText, setButtonText] = useState("Get My Orders");

  const [orders, setOrders] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector(state => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector(state => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  useEffect(() => {
    if (userInfo && Object.entries(userInfo).length <= 0) {
      history.push('/login');
    }
    else {
      if (!user.name) {
        dispatch(getUserDetails('profile'))
      }
      else {
        setName(user.name);
        setEmail(user.email);
        
      }
    }
  }, [dispatch,history, userInfo,user])

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
    }
    else {
      dispatch(updateUserProfile({
        id: user._id,
        name,
        email,
        password
      }))
    }
  }

  const getOrders = async (e) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        }
      };

    const { data } = await axios.get(`${api}/api/orders`, config);

      setOrders(data.orders);
      console.log(data.orders);
      setButtonText("Got your orders");
      e.target.disabled = true;

    } catch (error) {
      setButtonText("Error Occured. Reload page");
    }
    
  }

  const orderDetails = (id) => {
    history.push(`/order/${id}`)
  }

  return (
    <>
      <Meta />
      <Row>
        <Col md={3}>
          
        <h2> User Profile</h2>
        {message && (<Message variant="danger">{ message }</Message>)}
        {error && (<Message variant="danger"> {error} </Message>)}
        {success && (<Message variant="success"> Profile Updated </Message>)}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e)=>setName(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}></Form.Control>
          </Form.Group>
        <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary"> Update</Button>
        </Form>
        </Col>
        <Col md={9}>
          <h2> My Orders</h2>
          <Button variant="primary" onClick={getOrders}> {buttonText} </Button>
          {orders && (
            <table className="table responsive table-sm my-3">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Date</th>
      <th scope="col">Total</th>
      <th scope="col">Delivered</th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>
   {orders.map(order => (
     <tr key={order._id}>
       <th scope="row">{order._id}</th>
       <td>{order.createdAt.substring(0,10)}</td>
       <td>{order.totalPrice}</td>
       <td>{order.isDelivered ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>}</td>
       <td>  <Button onClick={() => { orderDetails(order._id) }} className="btn-sm" variant="light"> Details </Button>  </td>
    </tr>
   ))}
  </tbody>
</table>
          )}
        </Col>
      </Row>
    </>
  )
}

export default ProfileScreen
