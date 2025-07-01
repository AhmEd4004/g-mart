"use client"

import FavouriteProduct from "./_productComp/comp";
import styles from "./page.module.css";
import * as React from 'react'

export default function categories() {
  const [products, setProducts] = React.useState({})

  React.useEffect(()=> {
    const favourites = JSON.parse(localStorage.getItem('myFavourites')) || {}
    setProducts(favourites)
  }, [])

  const removeProduct = id => {
    const favourites = JSON.parse(localStorage.getItem('myFavourites'))
    delete favourites[id]
    localStorage.setItem("myFavourites", JSON.stringify(favourites))
    setProducts(favourites)
  }


  const cleanFavourites = () => {
    if (!window.confirm('Are you sure you want to clean your cart?')) return
    localStorage.removeItem('myFavourites')
    setProducts({})
  }

  return (
    <>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center'}}>  
        <h3>Favourite gifts</h3>
          {Object.keys(products).length > 0 && <p onClick={cleanFavourites}>Empty favourites</p>}
        </div>
      <div className={styles.productsCont}>
        {Object.keys(products).map(v=> {
          return <FavouriteProduct id={v} product={products[v]} key={v} removeProduct={removeProduct}/>
        })}
      </div>
      { Object.keys(products).length == 0 && 
      <div className={styles.emptyFav}>
        <img src='heart.png'/>
        Oops! Favourites is empty.
      </div>}
    </>
  );
}
