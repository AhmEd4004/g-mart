"use client"

import { useRef, useState } from "react";
import styles from "./page.module.css";
import Icon from "@/app/(homePage)/_components/icons/icon";

export default function SelectCategory({available}) {
    const [list, mainCont] = [useRef(null), useRef(null)]
    const [arrowDirection, setArrowDirection] = useState('arrowDown')
    const showList =  ()=> {
        const opened = list.current.style.display === "block"
        if (!opened) {
            mainCont.current.style.borderRadius = "8px 8px 0 0"
            mainCont.current.style.borderWidth = "1px"
            list.current.style.display = "block"
            setArrowDirection('arrowUp')
        } else {
            mainCont.current.style.borderRadius = "8px"
            mainCont.current.style.borderWidth = "0"
            list.current.style.display = "none"
            setArrowDirection('arrowDown')
        }
    }
    
    return (
        <div className={styles.cont} ref={mainCont}>
            <div className={styles.item} onClick={showList}>
                <Icon src="male" bold={true} width={18} height={18} color="#318535"/>
                <Icon src="female" bold={true} width={18} height={18} color="#318535"/>
                <Icon src="homeDecoration" bold={true} width={18} height={18} color="#318535"/>
                <p>Select gifts category</p>
                
                <div className={styles.arrow}><Icon src={arrowDirection} bold={false} width={10} height={10} color="#318535"/></div>
            </div>
            <div className={styles.itemsCont} ref={list}>
                {available.men && <a className={styles.item} onClick={showList} href="#menSection">
                    <Icon src="male" bold={true} width={20} height={20} color="#318535"/>
                    <p>Men accessories</p>
                </a>}
                {available.women && <a className={styles.item} onClick={showList} href="#womenSection">
                    <Icon src="female" bold={true} width={20} height={20} color="#318535"/>  
                    <p>Women accessories</p>
                </a>}
                {available.home && <a className={styles.item} onClick={showList} href="#homedecSection">
                    <Icon src="homeDecoration" bold={true} width={20} height={20} color="#318535"/>
                    <p>Home decoration</p>
                </a>}
                {available.others && <a className={styles.item} onClick={showList} href="#othersSection">  
                    <p>Others</p>
                </a>}
            </div>
        </div>
    );
}