"use client"

import Link from 'next/link'
import styles from './page.module.css'
import Icon from "@/app/(homePage)/_components/icons/icon";

export default function FavouriteProduct ({id, product, removeProduct}) {
    const link = `/categories/products/${id}`
    const remove = event => {
        event.preventDefault()
        removeProduct(id)
    }
    
    return (
        <Link className={styles.productCont} href={link}>
            <img src={product.imagePath} alt="Product image"/>
            <p>{product.name}</p>
            <div className={styles.heartButton} onClick={remove}><Icon src="heart" bold={true} width={12} height={12} color={"white"} contained={{color:"#FF3B30", padding:"10px"}}/></div>
        </Link>
    )
}