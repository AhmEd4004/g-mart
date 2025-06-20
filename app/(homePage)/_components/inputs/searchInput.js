"use client"

import styles from "./search.module.css";
import Icon from "../icons/icon";
import * as React from 'react';
import { useRouter } from "next/navigation";
import { Banknote, ArrowDownUp, ListFilter } from "lucide-react";


export default function SearchInput() {
    const [scrolling, setScrolling] = React.useState(false)
    const [filterWindow, setFilterWindow] = React.useState(false)
    const [filters, setFilters] = React.useState({})
    const router = useRouter()
    const searchButton = React.useRef(null)
    const searchInput = React.useRef(null)

    React.useEffect(() => {
        const storedFilters = JSON.parse(localStorage.getItem('searchFilters'))
        const d = new Date();
        const currentDay = d.getDay()
        if (storedFilters) {
            if (storedFilters.currentDay != currentDay) return localStorage.removeItem('searchFilters')
            setFilters(storedFilters)
        }

        const handleScroll = () => {
            if (window.scrollY > 1) {
                setScrolling(true);
            } else {
                setScrolling(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const showSearchButton = ()=> {
        if (searchInput.current.value == '') {
            searchButton.current.style.opacity = "0"
            return searchButton.current.style.visibility = "hidden"
        }
        searchButton.current.style.visibility = "visible"
        searchButton.current.style.opacity = "1"
    }

    const searchF = ()=> {
        searchButton.current.style.opacity = "0"
        searchButton.current.style.visibility = "hidden"
        let link = "/search?name="+searchInput.current.value.replace(' ', '-')

        // using filters
        Object.keys(filters).map( v => {
            if (!filters[v] || filters[v]=='' || v=='currentDay') return
            link += `&${v}=${filters[v]}`
        })
        router.push(link)
    }

    const openFilterF = ()=>{
        setFilterWindow(!filterWindow)
    }

    const updateFilters = (e)=> {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const body = Object.fromEntries(formData.entries())
        
        const d = new Date();
        const currentDay = d.getDay()

        const newData = {
            section: body.section,
            startPrice: body.startPrice,
            endPrice:  body.endPrice,
            sortByLowestPrice: body.sortByLowestPrice,
            currentDay
        }
        setFilters(newData)
        localStorage.setItem('searchFilters', JSON.stringify(newData))
        openFilterF()
    }

    const removeFilters = (e)=> {
        setFilters({})
        localStorage.removeItem('searchFilters')
        openFilterF()
    }

    return (
        <div className={`${styles.headerCont} ${scrolling?styles.scrollingEffect:''}`}>
            <div className={styles.searchCont} style={(filterWindow?{width:'0'}:{})}>
                <div className={styles.inputCont}>
                    <input ref={searchInput} placeholder="What are you looking for???" onChange={showSearchButton} onClick={showSearchButton}/>
                    <div className={styles.primaryIcon}><Icon src="search" bold={false} width={16} height={16} color="#AEAEAE"/></div>
                    <button ref={searchButton} className={styles.searchButton+" greenButton"} onClick={searchF}>Go</button>
                </div>

                <div onClick={openFilterF}>
                    <Icon src="filter" bold={false} width={24} height={24} color="#2E7D32"/>
                </div>
            </div>

            { filterWindow && <SearchFilter filters={filters} updateFilters={updateFilters} removeFilters={removeFilters} closeF={openFilterF}/>
            }
        </div>
    );
}


export function SearchFilter ({filters, updateFilters, removeFilters, closeF}) {
    const form = React.useRef(null)

    React.useEffect(()=>{
        requestAnimationFrame(()=> form.current.style.opacity="1")
    })

    return (
        <form className={styles.filtersForm} onSubmit={updateFilters} ref={form}>
            <div className={styles.buttonsCont}>
                <div>
                    <button type="reset" className="outLinedButton" onClick={closeF}>X</button>
                </div>
                <div style={{display:'flex', gap:'8px'}}>
                    <button type="reset" className="outLinedButton" onClick={removeFilters}>Clear</button>
                    <button type="submit" className="greenButton" style={{padding:"6px 16px"}}>Apply</button>
                </div>
            </div>
            <div className={styles.bodyCont}>
                <div className={styles.flexCont} style={{justifyContent:"space-between"}}>
                    <div className={styles.flexCont} style={{gap:"4px"}}>
                        <ListFilter size={20} color="#45BA4B" />
                        <p>Gifts for: </p>
                    </div>
                    <div className={styles.flexCont} style={{gap:"8px"}}>
                        <div className={styles.flexCont} style={{gap:"4px"}}>
                            <input type="radio" id="allRadio" name="section" value="all" defaultChecked={filters?.section?filters.section=="all":true}/>
                            <label htmlFor="allRadio">All</label>
                        </div>
                        <div className={styles.flexCont} style={{gap:"4px"}}>
                            <input type="radio" id="menRadio" name="section" value="men" defaultChecked={filters?.section=="men"}/>
                            <label htmlFor="menRadio">Men</label>
                        </div>
                        <div className={styles.flexCont} style={{gap:"4px"}}>
                            <input type="radio" id="womenRadio" name="section" value="women" defaultChecked={filters?.section=="women"}/>
                            <label htmlFor="womenRadio">Women</label>
                        </div>
                        <div className={styles.flexCont} style={{gap:"4px"}}>
                            <input type="radio" id="otherRadio" name="section" value="other" defaultChecked={filters?.section=="other"}/>
                            <label htmlFor="otherRadio">Other</label>
                        </div>
                    </div>
                </div>
                <div className={styles.flexCont} style={{justifyContent:"space-between"}}>
                    <div className={styles.flexCont} style={{gap:"4px"}}>
                        <Banknote size={20} color="#45BA4B" />
                        <p>Price: </p>
                    </div>
                    <div className={`${styles.flexCont} ${styles.priceInput}`} style={{gap:"8px"}}>
                        <input type="number" placeholder={"Start price"} defaultValue={filters?.startPrice} name="startPrice"/>
                        <p> : </p>
                        <input type="number" placeholder={"End price"} defaultValue={filters?.endPrice} name="endPrice"/>
                    </div>
                </div>
                <div className={styles.flexCont} style={{justifyContent:"space-between"}}>
                    <div className={styles.flexCont} style={{gap:"4px"}}>
                        <ArrowDownUp size={20} color="#45BA4B" />
                        <label htmlFor="sortByLowestPrice">Sort from the lowest to heighest</label>
                    </div>
                    <input type="checkbox" id="sortByLowestPrice" name="sortByLowestPrice" defaultChecked={filters?.sortByLowestPrice}/>
                </div>
            </div>
        </form>
    )
}