"use client"
import styles from "./page.module.css"
import { Trash2 } from "lucide-react";
import * as React from 'react'
import getQuantity from "./_actions/productQuantity";

export default function QuantityComp({id, defaultQuantity, updateF}) {
    const [quantity, setQuantity] = React.useState(defaultQuantity || 1)
    const [maxQuantity, setMaxQuantity] = React.useState(1)

    React.useEffect(()=>{
        if (!defaultQuantity) {
            // get current quantity from local storage
            const cart = JSON.parse(localStorage.getItem('myCart'))
            if (cart[id]) setQuantity(cart[id].quantity)
        }
        // get max quantity
        const setMax = async ()=> {
            const data = await getQuantity(id)
            setMaxQuantity(data.quantity)
        }
        setMax()
    }, [])

    const counterClick = (e) => {
        e.preventDefault()
    }

    const add = async () => {
        if (quantity >= maxQuantity) return
        const cart = JSON.parse(localStorage.getItem('myCart'))
        cart[id].quantity++
        setQuantity(quantity+1)
        localStorage.setItem('myCart', JSON.stringify(cart))
        updateF()
    }

    const remove = () => {
        const cart = JSON.parse(localStorage.getItem('myCart'))
        if (quantity == 1) {
            delete cart[id]
        } else {
            cart[id].quantity--
            setQuantity(quantity-1)
        }
        localStorage.setItem('myCart', JSON.stringify(cart))
        updateF(quantity == 1?{removed: true}:{})
    }

    return (
        <div className={styles.productCount} onClick={counterClick}>
            <div onClick={remove} style={{display:'flex', alignItems:"center", justifyContent:'center'}}>{quantity>1?<p style={{width:'18px'}}>-</p>:<Trash2 size={18} color={'#222'}/>}</div>
            <p className={styles.counter}>{quantity}</p>
            <p onClick={add} style={{width:'18px', opacity:maxQuantity==quantity?'0':'1'}}>+</p>
        </div>
    )
}