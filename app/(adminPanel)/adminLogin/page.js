"use client"

import { Button, TextField } from '@mui/material'
import styles from './page.module.css'
import { User, LockKeyhole } from 'lucide-react'
import * as React from 'react'
import login from './loginActions'
import { useRouter } from 'next/navigation'


export default function page() {
    const router = useRouter();

    const [isPending, setIsPending] = React.useState(false)
    const [formError, setFormError] = React.useState(null)
    const [callbackUrl, setCallbackUrl] = React.useState('/adminPanel');

    // Use useEffect to safely access searchParams
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setCallbackUrl(params.get('callbackUrl') || '/adminPanel');
    }, []);
    
    const formSubmit = async e => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const loginData = {email: formData.get('email'), password: formData.get('password')}
        setIsPending(true)
        const loginResult = await login(loginData)
        if (!loginResult.success) {
            setFormError(loginResult.error)
            setIsPending(false)
        } else {
            router.push(callbackUrl)
        }
    }
    return (
    <div className={styles.loginCont}>
        <form className={styles.loginWindow} onSubmit={formSubmit}>
            <h2>Admin Login Panel</h2>
            <div style={{display:'flex', alignItems:'center', gap:'16px', flex:'1'}}>
                <div style={{paddingTop: '8px'}}><User color="#1976d2" size={30}/></div>
                <TextField label="Email" name="email" variant="filled" type="email" required fullWidth onChange={()=> setFormError(null)}/>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:'16px', flex:'1'}}>
                <div style={{paddingTop: '8px'}}><LockKeyhole color="#1976d2" size={30}/></div>
                <TextField label="Password" name="password" variant="filled" type="password" required fullWidth onChange={()=> setFormError(null)}/>
            </div>
            {formError && <p style={{color:'red'}}>{formError}</p>}
            <Button variant="contained" type='submit' disabled={isPending}>Login</Button>
        </form>
    </div>
    )
}