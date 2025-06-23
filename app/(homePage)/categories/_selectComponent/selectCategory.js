"use client"

import { useRef, useState } from "react";
import styles from "./page.module.css";
import Icon from "@/app/(homePage)/_components/icons/icon";
import { motion, AnimatePresence } from "motion/react";

export default function SelectCategory({available}) {
    const mainCont = useRef(null)
    const [isList, setIsList] = useState(false)
    const showList =  ()=> {
        if (!isList) {
            mainCont.current.style.borderRadius = "8px 8px 0 0"
            mainCont.current.style.borderWidth = "1px"
            setIsList (true)
        } else {
            mainCont.current.style.borderRadius = "8px"
            mainCont.current.style.borderWidth = "0"
            setIsList (false)
        }
    }
    
    return (
        <div className={styles.cont} ref={mainCont}>
            <div className={styles.item} onClick={showList}>
                <Icon src="male" bold={true} width={16} height={16} color="#318535"/>
                <Icon src="female" bold={true} width={16} height={16} color="#318535"/>
                <Icon src="homeDecoration" bold={true} width={16} height={16} color="#318535"/>
                <p>Select gifts category</p>
                
                <div className={styles.arrow}><Icon src={isList?'arrowUp':'arrowDown'} bold={false} width={10} height={10} color="#318535"/></div>
            </div>
            <AnimatePresence>
            {isList && 
            (<motion.div className={styles.itemsCont}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}>
                {available.men && <a className={styles.item} onClick={showList} href="#menSection">
                    <Icon src="male" bold={true} width={16} height={16} color="#318535"/>
                    <p>Men accessories</p>
                </a>}
                {available.women && <a className={styles.item} onClick={showList} href="#womenSection">
                    <Icon src="female" bold={true} width={16} height={16} color="#318535"/>  
                    <p>Women accessories</p>
                </a>}
                {available.home && <a className={styles.item} onClick={showList} href="#homedecSection">
                    <Icon src="homeDecoration" bold={true} width={16} height={16} color="#318535"/>
                    <p>Home decoration</p>
                </a>}
                {available.others && <a className={styles.item} onClick={showList} href="#othersSection">  
                    <p>Others</p>
                </a>}
            </motion.div>)}
        </AnimatePresence>
        </div>
    );
}