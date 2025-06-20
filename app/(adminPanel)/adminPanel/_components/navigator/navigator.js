"use client"
import Link from "next/link"
import styles from "./page.module.css"
import { ChevronRight } from "lucide-react"

export default function Navigator ({last, current, children}) {
    const lastRoutes = last
    const titles = Object.keys (lastRoutes)
    return (
        <div className={styles.titleCont}>
            {titles.map((v, i) => {
                return (
                    <h3 key={lastRoutes[v]}><Link href={lastRoutes[v]} className={styles.lastRoutes}>{v}</Link>
                    <ChevronRight width={24} height={24} key={i} color={'#222b'}/>
                    </h3>
                )
            })}
            <h2><Link href="">{current}</Link></h2>
            {children}
        </div>
    )
}