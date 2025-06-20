"use server"

import { signIn } from "@/app/api/auth/[...nextauth]/route";
import {z} from 'zod'
import { redirect } from 'next/navigation'


const loginScheme = z.object({
    email: z.string().email({message: 'Enter a valid email and password!'}),
    password: z.string({message: 'Enter a valid email and password!'}).min(6, {message: 'Enter a valid email and password!'})
})

export default async function login (loginData) {
    const dataValidation = loginScheme.safeParse({email: loginData.email, password: loginData.password})
    if (!dataValidation.success) return {success: false, error: dataValidation.error.issues[0].message}
    

    try {
        const authResult = await signIn('credentials', {
        ...loginData,
        redirect: false // Handle redirect manually
        });
    } catch {
        return {success: false, error: 'Email or password is not correct!'}
    }
    
    return {success: true}
}