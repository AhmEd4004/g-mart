"use client"

import Link from "next/link";
import styles from "./page.module.css";
import Icon from "@/app/(homePage)/_components/icons/icon";
import * as React from "react";
import QuantityComp from "@/app/(homePage)/_components/quantityComp/quantityComp";

export default function Product({id, title, price, priceBefore, discount, descri, imgSrc}) {
    const link = `products/${id}`

    const [inCart, setInCart] = React.useState(false)

    React.useEffect(()=>{
        const cart = JSON.parse(localStorage.getItem("myCart")) || {}
        if (cart[id]) {
            setInCart (cart[id].quantity)
        }
        const myFavourites = JSON.parse(localStorage.getItem("myFavourites")) || {}
        if (myFavourites[id]) setInFav (!inFav)
    }, [])

    const addToCart = (e) => {
        e.preventDefault()
        const cart = JSON.parse(localStorage.getItem("myCart")) || {}
        if (!inCart) {cart[id] = {name: title, price, discount, imagePath: imgSrc, quantity: 1}}
        else {delete cart[id]}
        localStorage.setItem("myCart", JSON.stringify(cart));
        setInCart (1)
    }

    const [inFav, setInFav] = React.useState(false)
    const addToFav = (e) => {
        e.preventDefault()
        const myFavourites = JSON.parse(localStorage.getItem("myFavourites")) || {}
        if (!inFav) {myFavourites[id] = {name: title, imagePath: imgSrc}}
        else {delete myFavourites[id]}
        localStorage.setItem("myFavourites", JSON.stringify(myFavourites));
        setInFav (!inFav)
    }

    const removeFromCart = data => {
        if (data?.removed) setInCart(false)
    }

    return (
        <Link className={styles.mainCont} href={link}>
            <img src={imgSrc} alt="Product Image" loading="lazy"/>
            <div className={styles.infCont}>
                <div className={styles.titleCont}>
                    <p className={styles.title}>{title}</p>
                    <div className={styles.priceMainCont}>
                        <div className={styles.priceCont}><span>EGP</span><p>{price.toLocaleString('en-US')}</p></div>
                        <div className={styles.discountCont}>
                            <p>{discount}%</p>
                            <p>{priceBefore.toLocaleString('en-US')}</p>
                        </div>
                    </div>
                    <div className={styles.descriCont}>{descri}</div>
                </div>
                <div className={styles.actionsCont}>
                    <div onClick={addToFav}><Icon src="heart" bold={inFav} width={12} height={12} color={inFav?"white":"#FF3B30"} contained={{color:"#FF3B30", padding:"10px"}}/></div>
                    {!inCart &&<button className="greenButton" style={{boxShadow:"var(--Normal_shadow)", flex:'1'}} onClick={addToCart}>Add to cart</button>}
                    {inCart && <QuantityComp id={id} quantity={inCart} updateF={removeFromCart}/>}
                </div>
            </div>
        </Link>
    );
}