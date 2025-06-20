"use client"

import styles from "./page.module.css";
import { usePathname } from "next/navigation";
import Link from 'next/link';
import Icon from "../icons/icon";

export default function NavBar() {
    const pathName = usePathname()

    return (
    <div className={styles.navigationBar}>
        <Link href="/categories" className={styles.links}>
            <Icon
            src="category" 
            bold={pathName.includes("/categories") ? true : false} 
            width={24} height={24}
            color={pathName.includes("/categories") ? "#318535" : "#888"}/>
            <p className={pathName.includes("/categories") ? styles.navSelected : ""}>Categories</p>
        </Link>
        <Link href="/Favourites" className={styles.links}>
            <Icon
            src="heart" 
            bold={pathName.includes("/Favourites") ? true : false} 
            width={24} height={24}
            color={pathName.includes("/Favourites") ? "#318535" : "#888"}/>
            <p className={pathName.includes("/Favourites") ? styles.navSelected : ""}>Favourites</p>
        </Link>
        <Link href="/cart" className={styles.links}>
            <Icon
            src="cart" 
            bold={pathName.includes("/cart") ? true : false} 
            width={24} height={24}
            color={pathName.includes("/cart") ? "#318535" : "#888"}/>
            <p className={pathName.includes("/cart") ? styles.navSelected : ""}>Cart</p>
        </Link>
    </div>
    );
}