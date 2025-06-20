"use client"

import Product from './_productComp/product'
import styles from './page.module.css'
import * as React from 'react'
import { Eraser } from 'lucide-react'
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
            {Object.keys(products).length > 0 && <div style={{display:'flex', gap:'8px', alignItems:'center', color:'#828282'}} onClick={cleanCart}><Eraser size={18} color="#828282" /> Empty cart</div>}
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
        </div>
        {totalPrice > 0 && <div className={styles.checkoutCont}>
            <p>Total Cost: {totalPrice.toLocaleString('en-US')} EGP</p>
            <button className="CTAButton" onClick={checkOutF}>Checkout</button>
        </div>}
    </>
    )
}