"use client"

import styles from "./input.module.css";

export default function Input({leftIcon, rightIcon, ...props}) {
    return (
        <div className={styles.inputCont}>
            {leftIcon && <div className={styles.leftIconCont}>
                {leftIcon}
            </div>}
            {rightIcon && <div className={styles.rightIconCont}>
                {rightIcon}
            </div>}
            <input style={{paddingLeft: leftIcon?'32px':'', paddingRight: rightIcon?'32px':''}} {...props}/>
        </div>
    );
}

export function SelectInput({placeholder, leftIcon, defaultValue, children, ...props}) {
    return (
        <div className={styles.inputCont}>
            {leftIcon && <div className={styles.leftIconCont}>
                {leftIcon}
            </div>}
            <select style={{paddingLeft: leftIcon?'32px':''}} defaultValue={defaultValue} {...props}>
                {children}
            </select>
        </div>
    );
}