import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PaymentForm from './screens/PaymentForm';
import OrderScreen from './screens/OrderScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import { Container } from 'react-bootstrap';
import { HashRouter as Router, Route, Switch } from 'react-router-dom'; 

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Switch>
          <ProtectedRoute path="/shipping" component={ShippingScreen} />
          <ProtectedRoute path="/payment" component={PaymentScreen} />
          <ProtectedRoute path="/placeorder" component={OrderScreen} />
          <Route path="/admin/orderlist" component={OrderListScreen} />
          <Route path="/order/:id" component={OrderDetailScreen} />  
          <Route path="/login" component={LoginScreen} />
          <Route path="/paymentform" component={PaymentForm} />  
          <Route path="/register" component={RegisterScreen} />
          <Route path="/profile" component={ProfileScreen} />
          <Route path="/admin/userlist" component={UserListScreen} />
          <Route path="/admin/productlist" component={ProductListScreen} />
          <Route path="/admin/product/:id/edit" component={ProductEditScreen} />  
          <Route exact path="/admin/user/:id/edit" component={UserEditScreen} />  
          <Route path="/search/:keyword" component={HomeScreen} exact />
          <Route path="/page/:pageNumber" component={HomeScreen} exact />
          <Route path="/search/:keyword/page/:pageNumber" component={HomeScreen} exact />
          <Route exact path="/" component={HomeScreen} />
          <Route path="/product/:id" component={ProductScreen} /> 
          <Route path="/cart/:id?" component={CartScreen} />
            </Switch>
        </Container>
      </main>
      
      <Footer />
    </Router>
  );
}

export default App;
