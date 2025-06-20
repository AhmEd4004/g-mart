"use client"

import styles from "./page.module.css";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from "next/navigation";

export default function CategoryItem({imgSrc, categoryName, section}) {
    const pathname = usePathname();
    const link = `${pathname}/${section}-${categoryName.toLowerCase()}`
    return (
        <Link className={styles.category} href={link}>
            <div className={styles.imgCont}>
                <Image src={imgSrc} fill style={{ objectFit: 'contain' }} alt={categoryName}/>
            </div>
            <p>{categoryName}</p>
        </Link>
    );
}