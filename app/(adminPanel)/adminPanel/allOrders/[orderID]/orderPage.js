"use client"

import * as React from 'react'
import styles from './page.module.css'
import Navigator from "../../_components/navigator/navigator"
import { MapPin, Calendar, MapPinHouse,Phone, User, Mail, Pencil, ListChecks  } from 'lucide-react'
import { Button, FormControl, MenuItem, Select, TextField } from '@mui/material'
import {governsData} from '@/data/governs'
import {updateOrder, removeOrder} from './_actions'
import { useParams, useRouter } from 'next/navigation'
import { z } from "zod"


export default function OrderPage ({order, orderProducts}) {
    const [actionsDisabled, setActionsDisabled] = React.useState(false)
    const router = useRouter()

    const statusClrs = {delivered: '#22bb33', rejected: '#bb2124', shipping: '#5bc0de', acceptance:'#5bc0de'}

    const formatedDate = order.createdAt.toLocaleString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})

    const totalPrice = Object.values(order.products).reduce((sum, product) => sum + Number(product.instantPrice)*product.quantity, 0)

    const setDileveredF = async()=> {
        if (!confirm('Set this order as delivered???')) return
        setActionsDisabled(true)
        await updateOrder (order.id, 'process', 'delivered')
        window.location.reload()
    }

    const acceptF = async()=> {
        if (!confirm('Set this order as accepted, and being shipped???')) return
        setActionsDisabled(true)
        await updateOrder (order.id, 'process', 'shipping')
        window.location.reload()

    }

    const rejectF = async()=> {
        if (!confirm('Set this order as rejected???')) return
        setActionsDisabled(true)
        await updateOrder (order.id, 'process', 'rejected')
        window.location.reload()

    }

    const removeF = async ()=> {
        if (!confirm('Are you sure you want to remove this order completely???')) return
        setActionsDisabled(true)
        await removeOrder(order.id)
        router.push('/adminPanel/allOrders')

    }
    

    // note that inputs names should match with the actual data base columns names
    return (
        
    <div className={styles.frame}>
        <Navigator  last={{"Home": "/adminPanel"}} current={"Order review"}><ListChecks size={20} /></Navigator>
        <div className={styles.orderCont}>
            <h3>Order infromation</h3>
            <div className={styles.girdCont}>
                <div className={styles.cell}>
                    <h4><Calendar size={16} /> Created at</h4>
                    <p>{formatedDate}</p>
                </div>
                <div className={styles.cell}>
                    <h4><MapPin size={16} /> Order location</h4>
                    <LocationParagraph>{order.receiverGovernment} - {order.receiverCity}</LocationParagraph>
                </div>
                <div className={styles.cell}>
                    <h4><Mail size={16} /> Contact email</h4>
                    <InputParagraph name={'ownerEmail'}>{order.ownerEmail}</InputParagraph>
                </div>
                <div className={styles.cell}>
                    <h4><Phone size={16} /> Contact phone</h4>
                    <InputParagraph name={'ownerPhone'}>{order.ownerPhone}</InputParagraph>
                </div>
                <div className={styles.cell}>
                    <h4><User size={16} /> Reciver name</h4>
                    <InputParagraph name={'receiverName'}>{order.receiverName}</InputParagraph>
                </div>
                {order.receiverPhone && <div className={styles.cell}>
                    <h4><Phone size={16} /> Reciver phone</h4>
                    <InputParagraph name={'receiverPhone'}>{order.receiverPhone}</InputParagraph>
                </div>}
                <div className={styles.cell}>
                    <h4><MapPinHouse size={16} /> Reciver address</h4>
                    <InputParagraph name={'receiverAddress'}>{order.receiverAddress}</InputParagraph>
                </div>
                {order.receiverExtraAddress && <div className={styles.cell}>
                    <h4><MapPinHouse size={16} /> Reciver extra address</h4>
                    <InputParagraph name={'receiverExtraAddress'}>{order.receiverExtraAddress}</InputParagraph>
                </div>}
                {!order.receiverPhone&&<p><span style={{color:'red'}}>Note:</span> The order receiver is different than the sender</p>}
            </div>
            <span style={{borderBottom:'1px solid #C7C7C7'}}></span>
            <div className={styles.girdCont}>
                <div with={{width:'30%'}}>
                    <h4>Payment method</h4>
                    <p style={{color:'#118c4f'}}>Cash</p>
                </div>
                <div with={{width:'30%'}}>
                    <h4>Current Process</h4>
                    <p><span style={{color:statusClrs[order.process]}}>{order.process}</span></p>
                </div>
                <div with={{width:'30%'}}>
                    <h4>Confirmation number</h4>
                    <p>{order.id}</p>
                </div>
            </div>
            <span style={{borderBottom:'1px solid #C7C7C7'}}></span>
            <h3>Order products</h3>
            <div className={styles.girdCont}>
                {orderProducts.map(v=>{
                    return <OrderProduct product={v} productPrice={order.products[v.id].instantPrice} productQuantity={order.products[v.id].quantity} products={order.products} key={v.id}/>
                })}
                
            </div>
            <span style={{borderBottom:'1px solid #C7C7C7'}}></span>
            <h3>Total price: {totalPrice}$</h3>
        </div>
        <div style={{display:'flex', gap: '16px', direction:'rtl'}}>
            <Button variant="contained" color={'error'} onClick={removeF} disabled={actionsDisabled}>Remove</Button>
            {order.process!='rejected'&& <Button variant="contained" color={'error'} onClick={rejectF} disabled={actionsDisabled}>Reject</Button>}
            {(order.process=='acceptance'||order.process=='rejected')&& <Button variant="contained" color={'success'} onClick={acceptF} disabled={actionsDisabled}>Accept</Button>}
            {order.process!='delivered'&&<Button variant="contained" color={'success'} onClick={setDileveredF} disabled={actionsDisabled}>Set as delivered</Button>}
        </div>
    </div>
    )
}


const validSchema = z.object({
    ownerEmail: z.string().email({ message: "Email is required" }).optional(),
    ownerPhone: z.string().min(4, { message: "Phone number must be at least 4 digits" }).max(16, { message: "Phone number maximum is 16 digits" }).optional(),
    receiverPhone: z.string().min(4, { message: "Phone number must be at least 4 digits" }).max(16, { message: "Phone number maximum is 16 digits" }).optional(),
})

export function InputParagraph({children, defaultValue='Enter new value', name}) {
    const [editIcon, showEditIcon] = React.useState(false)
    const [input, showInput] = React.useState(false)
    const [value, setValue] = React.useState(null)
    const [disabled, setDisabled] = React.useState(false)

    const params = useParams();
    const orderID = params.orderID;

    const updateF = async ()=> {
        if (!value) return window.alert('You must enter a valid value')
        const result = validSchema.safeParse({[name]: value})
        if (!result.success) return alert(result.error.issues[0].message)
        setDisabled(true)
        await updateOrder(orderID, name, value)
        window.location.reload()
    }

    return (
        <>
        {!input &&
        <div className={styles.editableP} onMouseEnter={()=> {showEditIcon(true)}} onMouseLeave={()=> {showEditIcon(false)}}>
            <p>{children}</p>
            {editIcon && <Pencil size={20} onClick={()=>{showInput(true)}}/>}
        </div>
        }
        {input &&
        <div style={{display:'flex', gap:'16px', padding:'4px 8px'}}>
            <TextField hiddenLabel variant="standard" placeholder={defaultValue} size="small" onChange={event=> {setValue(event.target.value)}} fullWidth/>
            <div style={{display:'flex', gap:'8px'}}>
                <Button variant="contained" size="small" onClick={updateF} disabled={disabled}>Save</Button>
                <Button variant="outlined" size="small" onClick={()=>{showInput(false)}}>Close</Button>
            </div>
        </div>
        }
        </>
    )
}

export function LocationParagraph({children}) {
    const [editIcon, showEditIcon] = React.useState(false)
    const [input, showInput] = React.useState(false)
    const [selectedGovern, setSelectedGovern] = React.useState('Cairo')
    const [selectedCity, setSelectedCity] = React.useState(governsData[selectedGovern][0])
    const [disabled, setDisabled] = React.useState(false)

    const params = useParams();
    const orderID = params.orderID;

    const updateF = async ()=> {
        setDisabled(true)
        updateOrder(orderID, 'receiverGovernment', selectedGovern)
        await updateOrder(orderID, 'receiverCity', selectedCity)
        window.location.reload()
    }

    return (
        <>
        {!input &&
        <div className={styles.editableP} onMouseEnter={()=> {showEditIcon(true)}} onMouseLeave={()=> {showEditIcon(false)}}>
            <p>{children}</p>
            {editIcon && <Pencil size={20} onClick={()=>{showInput(true)}}/>}
        </div>
        }
        {input &&
        <div style={{display:'flex', gap:'16px', padding:'4px 8px'}}>
            <FormControl variant="standard" fullWidth>
                <Select
                value={selectedGovern}
                onChange={event=>{setSelectedGovern(event.target.value); setSelectedCity(governsData[event.target.value][0])}}
                size="small"
                >
                {Object.keys(governsData).map(v=> {
                    return <MenuItem value={v} key={`order_Govern_${v}`}>{v}</MenuItem>
                })}
                </Select>
            </FormControl>
            <FormControl variant="standard" fullWidth>
                <Select
                value={selectedCity}
                onChange={event=>{setSelectedCity(event.target.value)}}
                size="small"
                >
                {governsData[selectedGovern].map(v=> {
                    return <MenuItem value={v} key={`order_City_${v}`}>{v}</MenuItem>
                })}
                </Select>
            </FormControl>
            <div style={{display:'flex', gap:'8px'}}>
                <Button variant="contained" size="small" onClick={updateF} disabled={disabled}>Save</Button>
                <Button variant="outlined" size="small" onClick={()=>{showInput(false)}}>Close</Button>
            </div>
        </div>
        }
        </>
    )
}

export function OrderProduct({product,productPrice, productQuantity, products}) {
    const [disabled, setDisabled] = React.useState(false)

    const params = useParams()
    const orderID = params.orderID

    const removeF = async () => {
        if (disabled) return
        if (!confirm('Are you sure you want to remove this product completely from the order?')) return

        const data = products
        delete data[product.id]
        await updateOrder(orderID, 'products', data)
        window.location.reload()
    }

    return (
        <div style={{width:'48%', display:'flex', gap:'32px'}}>
            <div className={styles.imgCont}>
                <img src={product.imagePaths[0]}/>
            </div>
            <div className={styles.productInfoCont}>
                <p>{product.name}</p>
                <p>Price at order time: {productPrice}$</p>
                <div className={styles.productQuantityCont}>
                    <p>Quantity: {productQuantity}</p>
                    <p onClick={removeF}>remove</p>
                </div>
            </div>
        </div>
    )
}