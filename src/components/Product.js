import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';

function Product({product}) {
  return (
    <>
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />  
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>
            <strong> {product.name} </strong>
          </Card.Title>
        </Link>
        <Card.Text as="div" className="py-2">
         
            {/* <Rating value={product.rating} text={`${product.numReviews} reviews`} /> */}
            <StarRatings
          rating={product.rating}
          starRatedColor="yellow"
          starDimension="20px"
          starSpacing="0"
          numberOfStars={5}
          name='rating'
            />
            {product.numReviews} reviews
         
        </Card.Text>
        <Card.Text as="h3" className="py-2">
          ${product.price} 
        </Card.Text>
      </Card.Body>

      </Card>
      </>
  )
}

export default Product
