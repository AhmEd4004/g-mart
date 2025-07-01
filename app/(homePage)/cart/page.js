"use client"

import Product from './_productComp/product'
import styles from './page.module.css'
import * as React from 'react'
import { useRouter } from 'next/navigation'

export default function page() {
    const router = useRouter()
    const [products, setProducts] = React.useState({})
    const [totalPrice, setTotalPrice] = React.useState(0)

    React.useEffect(()=> {
        const cart = JSON.parse(localStorage.getItem("myCart")) || {}
        setProducts(cart)
    }, [])

    React.useEffect(()=> {
        setTotalPrice(Object.values(products).reduce((sum, product) => sum + Number(product.price)*product.quantity, 0))
    }, [products])
    
    const quantityUpdateF = () => {
        const cart = JSON.parse(localStorage.getItem("myCart"))
        setProducts(cart)
    }
    const cleanCart = () => {
        if (!window.confirm('Are you sure you want to clean your cart?')) return
        localStorage.removeItem('myCart')
        setProducts({})
    }

    const checkOutF = ()=> {
        router.push('cart/checkout')
    }

    return (
    <>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center'}}>  
            <h3>My cart</h3>
            {Object.keys(products).length > 0 && <p onClick={cleanCart}>Empty cart</p>}
        </div>
        <div className={styles.productsFrame}>
            {Object.keys(products).map(v=>{
                return <Product
                key={v}
                id = {v}
                title={products[v].name}
                price={products[v].price.toLocaleString('en-US')}
                quantity={products[v].quantity}
                discount={products[v].discount}
                imgSrc={products[v].imagePath}
                quantityUpdateF={quantityUpdateF}
                />
            })}
            { Object.keys(products).length == 0 &&
            <div className={styles.emptyCart}>
                <img src='empty_cart.svg'/>
                Oops! Your cart is empty.
            </div>}
            { Object.keys(products).length > 0 && <div style={{height:'136px'}}></div>}
        </div>
        {totalPrice > 0 && <div className={styles.checkoutCont}>
            <p>Total Cost: {totalPrice.toLocaleString('en-US')} EGP</p>
            <button className="CTAButton" onClick={checkOutF}>Checkout</button>
        </div>}
    </>
    )
}