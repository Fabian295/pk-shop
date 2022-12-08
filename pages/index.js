import React from 'react';
import { Product, FooterBanner, HeroBanner, Model } from '../components';
import { client } from '../lib/client';

const Home = ({ products, bannerData, models }) => {
  return (
    <>
      <HeroBanner HeroBanner={ bannerData.length && bannerData[0] }/>

      <div className='products-heading'>
        <h2>Best Selling Products</h2>
        <p>Speakers of many variations</p>
      </div>

      <div className='products-container'>
        { models?.map((model) => {
          return <Model key={model._id} model={model} />
        })}
        {products?.map(
          (product) => <Product key={product._id}
          product={product} />
        )}
      </div>

      <FooterBanner footerBanner={ bannerData && bannerData[0] }/>
    </>
  )
}

export const getServerSideProps = async ()  => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  const modelQuery = '*[_type == "model"]';
  const models = await client.fetch(modelQuery)

  return {
    props: { products, bannerData, models }
  }
}

export default Home