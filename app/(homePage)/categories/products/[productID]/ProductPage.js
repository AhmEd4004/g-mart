"use client"

import styles from "./page.module.css";
import * as React from 'react'
import Icon from "@/app/(homePage)/_components/icons/icon";
import QuantityComp from "@/app/(homePage)/_components/quantityComp/quantityComp";


export default function ProductPage({ product }) {

  const beforePrice = Math.round(product.price/(1-(product.discount/100))).toLocaleString('en-US')

  const [inCart, setInCart] = React.useState(false) // also holds the inital quantity of the product if it is in cart
  
  const addToCart = () => {
    const myCart = JSON.parse(localStorage.getItem("myCart")) || {}
    myCart[product.id] = {name: product.name, price: product.price,
      discount: product.discount, imagePath: product.imagePaths[0], quantity: 1}
    localStorage.setItem("myCart", JSON.stringify(myCart));
    setInCart (1)
  }

  const removeFromCart = data => {
    if (data?.removed) setInCart(false)
  }

  React.useEffect(()=>{
    const myCart = JSON.parse(localStorage.getItem("myCart")) || {}
    if (myCart[product.id]) setInCart (myCart[product.id].quantity)
  }, [])

  return (
    <>
      <ProductImages id={product.id} name={product.name} imagePaths={product.imagePaths}/>
      <div className={styles.infHeaderCont}>
        <p className={styles.heading}>{product.name}</p>
        <div className={styles.priceCont}>
          <div>
            <div className={styles.price}><span>EGP</span><p>{product.price.toLocaleString('en-US')}</p></div>
            <div className={styles.discount}>
                <p>{product.discount}% discount</p>
                <p>Was EGP {beforePrice}</p>
            </div>
          </div>
          {inCart && <div className={styles.inCart}>
            <QuantityComp id={product.id} quantity={inCart} updateF={removeFromCart}/>
            <p style={{color: "#909090", fontSize:"10px"}}>In cart</p>
          </div>}
       </div>
      </div>
      {!inCart && <button onClick={addToCart} className="CTAButton">Add to cart</button>}
      {product.description&&<div className={styles.descriptionCont}>
        <p className={styles.descriHeading}>Discription</p>
        <p className={styles.descriptionText}>{product.description}</p>
      </div>}
    </>
  )
  
}

export function ProductImages ({id, name, imagePaths}) {
  const [selectedDot, setSelectedDot] = React.useState(0)
  
  const [inFav, setInFav] = React.useState(false)
  const addToFav = (e) => {
    e.preventDefault()
    const myFavourites = JSON.parse(localStorage.getItem("myFavourites")) || {}
    if (!inFav) {myFavourites[id] = {name, imagePath: imagePaths[0]}}
    else {delete myFavourites[id]}
    localStorage.setItem("myFavourites", JSON.stringify(myFavourites));
    setInFav (!inFav)
  }

  React.useEffect(()=>{
    const myFavourites = JSON.parse(localStorage.getItem("myFavourites")) || {}
    if (myFavourites[id]) setInFav (!inFav)
  }, [])

  return (
      <div className={styles.imgMainCont}>
        <div onClick={addToFav} className={styles.heartButton}><Icon src="heart" bold={inFav} width={12} height={12} color={inFav?"white":"#FF3B30"} contained={{color:"#FF3B30", padding:"10px"}}/></div>
        {imagePaths.length>1 && <div className={styles.indexDots}>
            <div>
                {imagePaths.map((v, i)=>{
                    return (<span className={selectedDot == i?styles.selected : undefined} key={v}></span>)
                })}
            </div>
        </div>}
        <div className={styles.imgsSlider} onScroll={e=>setSelectedDot(Math.floor(e.target.scrollLeft/e.target.clientWidth))}>
        {imagePaths.map(v=>{
            return (<div className={styles.imgCont} key={v}>
                <img src={v} alt="Product Image" />
            </div>)
        })}
        </div>
      </div>
  )
}