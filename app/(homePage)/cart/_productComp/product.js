import Link from "next/link";
import styles from "./comp.module.css";
import QuantityComp from "../../_components/quantityComp/quantityComp";

export default function Product({id, title, price, discount, quantity, imgSrc, quantityUpdateF}) {
    const link = `/categories/products/${id}`
    console.log(link)

    return (
        <Link className={styles.mainCont} href={link}>
            <img src={imgSrc} alt="Product Image"/>
            <div className={styles.infoCont}>
                <p className={styles.title}>{title}</p>
                
                <div className={styles.downPart}>
                    <div className={styles.priceMainCont}>
                        <div className={styles.priceCont}><span>EGP</span><p>{price}</p></div>
                        {discount > 0 && <p className={styles.discount}>{discount}%</p>}
                    </div>
                    <QuantityComp id={id} defaultQuantity={quantity} updateF={quantityUpdateF}/>
                </div>
            </div>
        </Link>
    );
}