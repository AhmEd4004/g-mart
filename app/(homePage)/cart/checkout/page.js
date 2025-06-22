"use client"

import styles from './page.module.css'
import * as React from 'react'
import { z } from 'zod';
import {governsData} from '@/data/governs' 
import Input, { SelectInput } from '@/app/(homePage)/_components/inputs/inputs'
import Icon from '@/app/(homePage)/_components/icons/icon';
import UserError from '@/app/(homePage)/_components/userErr/comp';
import addOrder from './orderActions';
import Image from 'next/image';
import { MapPinHouse, UserRound, Phone, Mail, BadgeCheck, Copy, CopyCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FallingLines } from 'react-loader-spinner'
import { motion, AnimatePresence } from "motion/react";


export default function OrderPageComp () {
    const [products, setProducts] = React.useState({})
    const [currentWindow, setCurrentWindow] = React.useState('contact')

    React.useEffect(()=> {
        const cart = JSON.parse(localStorage.getItem("myCart")) || {}
        setProducts(cart)
    }, [])

    const continueF = ()=> {
        setCurrentWindow('payment')
    }

    const backToContactWindow = ()=> {
        setCurrentWindow('contact')
    }

    return (
        <>
            <div className={styles.headerCont}>
                <h3 onClick={backToContactWindow}>Address Info</h3>
                <Icon src={'arrowRight'} bold={true} width={24} height={24} color={currentWindow == "payment"?'#318535':'#31853577'}/>
                <h3 style={{color:currentWindow == "payment"?'#318535':'#31853577'}}>Payment</h3>
            </div>
            {currentWindow == "contact" && <ContactWindow continueF={continueF}/>}
            {currentWindow == "payment" && <PaymentWindow products={products}/>}
        </>
    )
}

export function ContactWindow ({continueF}) {
    const [selectedGovernment, setSelectedGovernment] = React.useState('Cairo')
    const [zodError, setZodError] = React.useState(null)
    const [isReceiver, setIsReceiver] = React.useState(false)

    const phoneSchema = z.string().min(4).max(16)
    const emailSchema = z.string().email()

    const submissionF = e => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const body = Object.fromEntries(formData.entries())
        const orderPhoneValidation = phoneSchema.safeParse(body.orderPhone)
        const receiverPhoneValidation = phoneSchema.safeParse(body.receiverPhone)
        const emailValidation = emailSchema.safeParse(body.orderEmail)
        if (!orderPhoneValidation.success) {return setZodError('Enter a valid order phone number')}
        if (!emailValidation.success) {return setZodError('Enter a valid email address')}
        if (!receiverPhoneValidation.success && isReceiver) {return setZodError('Enter a valid receiver phone number')}

        // store information then go to payment
        sessionStorage.setItem('contactInformation', JSON.stringify(body))
        continueF()
    }

    const selectGovernment = e => {
        setSelectedGovernment(e.target.value)
    }

    return (
        <form className={styles.mainCont} onSubmit={submissionF}>
            <div style={isReceiver?{display:'flex', flexDirection:'column', gap: '8px'}:{}}>
                <p style={{display:'flex', justifyContent:'space-between'}}>Check the box if the gift receiver is not you
                <input name='differentReceiver' type="checkbox" onClick={()=> {setIsReceiver(!isReceiver)}}/></p>
                <div className={`${styles.window} ${isReceiver?'':styles.window_hidden}`}>
                    <h4>Receiver Information</h4>
                    <Input name={isReceiver?'receiverName':''} placeholder={"Receiver name"} leftIcon={<UserRound size={16} color="#AEAEAE" />} required={isReceiver} minLength={8} maxLength={60} pattern="[A-Za-z\s]+" title="Only letters and spaces are allowed"/>
                    <Input name={isReceiver?'receiverPhone':''} placeholder={"Receiver Contact Nubmer"} leftIcon={<Phone size={16} color="#AEAEAE" />} required={isReceiver} type="number"/>
                </div>
            </div>
            <div className={styles.window}>
                <h4>Contact Information</h4>
                <div style={{maxHeight:isReceiver?'0':"400px", marginBottom:isReceiver?'-8px':'', transition:'0.3s'}}>
                    <Input name={!isReceiver?'receiverName':''} placeholder={"Your name"} leftIcon={<UserRound size={16} color="#AEAEAE" />} required minLength={8} maxLength={60} pattern="[A-Za-z\s]+" title="Only letters and spaces are allowed"/>
                </div>
                <Input name='orderEmail' placeholder={"Your Email Address"} leftIcon={<Mail size={16} color="#AEAEAE" />} required minLength={8} maxLength={60} type="email"/>
                <Input name='orderPhone' placeholder={"Your Contact Nubmer"} leftIcon={<Phone size={16} color="#AEAEAE" />} required type="number"/>
                <p className={styles.notes}> *Note: an ID will be sent to the above email and your contact number, so you can track your order.</p>
            </div>

            <div className={styles.window}>
                <h4>Reciver Address</h4>
                <SelectInput name='government' leftIcon={<MapPinHouse size={16} color="#AEAEAE" />} defaultValue={'Cairo'} onChange={selectGovernment} required>
                    {Object.keys(governsData).map (v => {
                        return <option value={v} key={v}>{v}</option>
                    })}
                </SelectInput>
                {selectedGovernment &&
                <SelectInput name='city' leftIcon={<MapPinHouse size={16} color="#AEAEAE" />} required>
                    {governsData[selectedGovernment].map (v => {
                        return <option value={v} key={v}>{v}</option>
                    })}
                </SelectInput>
                }
                <Input name='address' placeholder={"Address"} leftIcon={<MapPinHouse size={16} color="#AEAEAE" />} required minLength={4} maxLength={80}/>
                <Input name='extraAddress' placeholder={"Additional Address or nearby famous place"} leftIcon={<MapPinHouse size={16} color="#AEAEAE"/>} minLength={4} maxLength={80}/>
            </div>
            <br></br>
            <br></br>
            <button className={`${styles.continueButton} CTAButton`}>Continue</button>
            {zodError && <UserError error={zodError} errorSetter={setZodError}/>}
        </form>
    )
}

export function PaymentWindow ({products}) {
    const [paymentMethod, setPaymentMethod] = React.useState('cash')
    const [orderError, setOrderError] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [orderConfirmation, setConfirmation] = React.useState(null)

    const selectCash = ()=> {
        setPaymentMethod('cash')
    }

    const selectBank = ()=> {
        setPaymentMethod('bank')
    }

    const makeOrder = async e=> {
        if (loading) return
        e.preventDefault()
        setLoading(true)
        const productsData = Object.fromEntries(Object.entries(products).map(([key, prod])=>{
            const {quantity, name, price: instantPrice} = prod
            return [key, {name, quantity, instantPrice}]
        }))
        const newOrder = await addOrder(JSON.parse(sessionStorage.getItem('contactInformation')), productsData)
        setLoading(false)
        if (!newOrder) return setOrderError('There is something wrong, please re-enter contact and payment data!')
        setConfirmation (newOrder)
    }

    return (
        <>
        <form className={styles.mainCont} onSubmit={makeOrder}>
            <p>Choose payment method</p>
            <div className={styles.paymentMethodCont}>
                <div className={paymentMethod=='cash'?styles.selected:''} onClick={selectCash}>
                    <Icon src={'cash'} color={"#318535"} width={20} height={20}/>
                    Cash on delivery
                </div>
                <div className={paymentMethod=='bank'?styles.selected:''} onClick={selectBank}>
                    <Icon src={'bankCard'} color={"#318535"} width={20} height={20}/>
                    Bank Card
                </div>
            </div>
            <div className={styles.orderDetails}>
                {paymentMethod=='bank' && <p>Paying with bank card is not available yet!</p>}
                <p>No. items: {Object.values(products).reduce((sum, product) => sum + product.quantity, 0)}</p>
                <p>Total price: {Object.values(products).reduce((sum, product) => sum + Number(product.price)*product.quantity, 0)}</p>
            </div>
            <button className={`${styles.continueButton} CTAButton`} style={paymentMethod=='bank'?{background:'grey'}:{}} disabled={loading || paymentMethod=='bank'}>Place your order</button>
            {orderError && <UserError error={orderError} errorSetter={setOrderError}/>}
        </form>
        {(loading || orderConfirmation) && <OrderLoading confrimationNumber={orderConfirmation}/>}
        </>
    )
}

export function OrderLoading ({confrimationNumber}) {
    const router = useRouter()
    const [copied, setCopied] = React.useState(false)
    const copyFunction = async ()=> {
        try {
        await navigator.clipboard.writeText(confrimationNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    return (
        <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.blackBackground}>
            <AnimatePresence mode="wait">
                {!confrimationNumber && (
                    <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    >
                    <FallingLines
                        color="#4fa94d"
                        width="160"
                        visible={true}
                        ariaLabel="falling-circles-loading"
                    />
                    <p style={{ color: "white" }}>Your order is under processing</p>
                    </motion.div>
                )}
                {confrimationNumber && (
                <motion.div
                key="thanks"
                className={styles.thanksCont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                >
                <div className={styles.thanksCont}>
                    <div style={{display:'flex', flexDirection:'column', gap:'8px', alignItems:'center'}}>
                        <Image src={'/thanksIllust.svg'} width={162} height={132} alt={'Thanks illustration'}/>
                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                            <p style={{fontWeight:'500'}}>Thanks for shopping</p>
                            <BadgeCheck size={20} color="#45BA4B" />
                        </div>
                        <p style={{color:'#B0B0B0', fontSize:'16px'}}>Order tracking Number</p>
                        <div style={{display:'flex', gap:'24px'}}>
                            <p style={{color:'var(--primaryClr_200)'}}>{confrimationNumber}</p>
                            <div onClick={copyFunction}>
                                {!copied&&<Copy size={20} color="#828282" />}
                                {copied&&<CopyCheck size={20} color="#828282" />}
                            </div>
                        </div>
                    </div>
                    <button className="greenButton" style={{boxShadow:"var(--Normal_shadow)", padding:"8px 24px"}} onClick={()=> router.push('/categories')}>Explore more gifts</button>
                </div>
                </motion.div>)}
            </AnimatePresence>
        </motion.div>
    )
}