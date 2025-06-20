"use client"

import Link from 'next/link';
import styles from './page.module.css'
import { LayoutList, Plus, ChartNoAxesGantt, ChartPie, Boxes, Truck, Hash, ChartBar } from 'lucide-react';
import * as React from 'react'
import { signOut } from "next-auth/react";

export default function AdminHome({analytics, adminName}) {
  const [logoutDisabled, setLogoutDisabled] = React.useState(false)
  const logoutF = ()=> {
    if (logoutDisabled) return
    signOut({ callbackUrl: '/adminLogin' })
  }

  return (
    <div className={styles.frame}>
      <div className={styles.header}>
        <p style={{fontWeight:'600', fontSize:'24px'}}>G<span style={{fontSize:'18px', color:'#6B6B6B'}}>.mart</span></p>
        <div style={{display:'flex', gap:'24px'}}>
          <p>{adminName}</p>
          <p style={{color:'blue', cursor:'pointer'}} onClick={logoutF}>Logout</p>
        </div>
      </div>
      <div className={styles.grid}>      
        <div className={styles.card}>
          <div className="hasIconCont">
            <h3>Products Control</h3>
            <Boxes size={20}/>
          </div>
          <ul>
            <p>From here you can</p>
            <div className="hasIconCont">
              <LayoutList size={20}/>
              <Link href="/adminPanel/productsList">Show all products + mutatation</Link>
            </div>
            <div className="hasIconCont">
              <Plus size={20}/>
              <Link href="/adminPanel/addProduct">Add new products</Link>
            </div>
          </ul>
        </div>
        
        <div className={styles.card}>
          <div className="hasIconCont">
            <h3>Categories List</h3>
            <ChartNoAxesGantt size={20}/>
          </div>
          <ul>
            <p>From here you can</p>
            <div className="hasIconCont">
              <LayoutList size={20}/>
              <Link href="/adminPanel/categoriesList">Show all Categories + mutation</Link>
            </div>
            <div className="hasIconCont">
              <Plus size={20} />
              <Link href="/adminPanel/addCategory">Add new category</Link>
            </div>
          </ul>
        </div>

        <div className={styles.card}>
          <div className="hasIconCont">
            <h3>Orders List</h3>
            <Truck size={20}/>
          </div>
          <ul>
            <p>From here you can</p>
            <div className="hasIconCont">
              <LayoutList size={20}/>
              <Link href="/adminPanel/newOrders">Show new orders (Accept & refuse)</Link>
            </div>
            <div className="hasIconCont">
              <LayoutList size={20}/>
              <Link href="/adminPanel/allOrders">Show & edit all orders</Link>
            </div>
          </ul>
        </div>

        <div className={styles.card}>
          <div className="hasIconCont">
            <h3>Analytics</h3>
            <ChartPie size={20}/>
          </div>
          <ul style={{gap:'8px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div className="hasIconCont">
                <Hash size={20}/>
                <p>of all categories</p>
              </div>
              <p>{analytics.categories}</p>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div className="hasIconCont">
                <Hash size={20}/>
                <p>of all products</p>
              </div>
              <p>{analytics.products}</p>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div className="hasIconCont">
                <Hash size={20}/>
                <p>of completed orders</p>
              </div>
              <p>{analytics.orders}</p>
            </div>
            <div className="hasIconCont">
              <ChartBar size={20}/>
              <p style={{cursor:'pointer', color:'darkblue'}}>Advanced analysis (feature version)</p>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}