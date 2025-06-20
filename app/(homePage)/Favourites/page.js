"use client"

import { Eraser } from "lucide-react";
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
          {Object.keys(products).length > 0 && <div style={{display:'flex', gap:'8px', alignItems:'center', color:'#828282'}} onClick={cleanFavourites}><Eraser size={18} color="#828282" /> Empty favourites</div>}
        </div>
      <div className={styles.productsCont}>
        {Object.keys(products).map(v=> {
          return <FavouriteProduct id={v} product={products[v]} key={v} removeProduct={removeProduct}/>
        })}
      </div>
    </>
  );
}
