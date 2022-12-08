import React, { useState } from 'react'

import { client, urlFor  } from '../../lib/client'
import { AiFillStar, AiOutlineMinus, AiOutlineStar, AiOutlinePlus } from 'react-icons/ai'
import { Product, Model } from '../../components'
import { useStateContext } from '../../context/StateContext';

const ProductDetails = ({ products, product, models, model }) => {
  const { image, name, details, price } = product || model;
  // const { image, name, details, price } = model;
  const [index, setIndex] = useState(0);
  const { decQty, incQty, qty, onAdd } = useStateContext();
  return (
    <div>
      <div className='product-detail-container'>
        <div>
          <div className="image-container">
            <img src={urlFor(image && image[index])} 
            // width={400} height={500} 
            className="product-detail-image" alt="" />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img 
              key={i}
              src={urlFor(item)}
              className={i === index ? 'small-image selected-image' : 'small-image'}
              onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

          <div className="product-detail-desc">
            <h1>{name}</h1>
            <div className="reviews">
              <div>
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiOutlineStar />
              </div>
              <p>
                (20)
              </p>
            </div>
            <h4>Details:</h4>
            <p>{details}</p>
            <p className="price">€ {price}</p>
            <div className="quantity">
              <h3>Quantity:</h3>
              <p className="quantity-desc">
                <span className="minus"
                onClick={decQty}
                >
                  <AiOutlineMinus />
                </span>
                <span className="num">{qty}</span>
                <span className="plus"
                onClick={incQty}
                >
                  <AiOutlinePlus />
                </span>
              </p>
            </div>
            <div className="buttons">
              <button className="add-to-cart"
              onClick={() => onAdd(product, model, qty)}
              >
                Add to Cart
              </button>
              <button className="buy-now"
              onClick={() => console.log('buy now')}
              >
                Buy Now
              </button>
            </div>
          </div>
    </div>

          <div className="maylike-products-wrapper">
            <h2>You may also like</h2>
            <div className="marquee">
              <div className="maylike-products-container track">
                {/* {allProds = products.concat(models)} */}
                {products.map((item) => (
                  <Product key={item._id}
                  product={item} />
                ))}
                {models.map((item) => (
                  <Model key={item._id}
                  model={item} />
                ))}
              </div>
            </div>
          </div>
    </div>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }`;
  const modelsQuery = `*[_type == "model"] {
    slug {
      current
    }
  }`;

  const products = await client.fetch(query);
  const models = await client.fetch(modelsQuery)
  const allProds = products.concat(models);

  const paths = allProds.map((product) => ({
    params: {
      slug: product.slug.current
    }
  }));

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params: { slug }})  => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]'

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery)

  // const bannerQuery = '*[_type == "banner"]';
  // const bannerData = await client.fetch(bannerQuery);

  const modelQuery = `*[_type == "model" && slug.current == '${slug}'][0]`;
  const modelsQuery = '*[_type == "model"]';

  const model = await client.fetch(modelQuery)
  const models = await client.fetch(modelsQuery)

  return {
    props: { products, product, models, model }
  }
}

export default ProductDetails