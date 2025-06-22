"use server"
import {z} from 'zod'
import { prisma } from "@/libs/prisma";
import { governsData } from '@/data/governs';

const nameSchema = z.string().min(8).max(60).regex(/^[A-Za-z\s]+$/);
const phoneSchema = z.string().min(4).max(16).regex(/^\d+$/)
const emailSchema = z.string().email().max(60)
const addressSchema = z.string().min(4).max(60);

const getConfirmationNumber = async()=> {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomConfirmation = '';
    for (let i = 0; i < 10; i++) {
        randomConfirmation += characters[Math.floor(Math.random() * characters.length)];
    }

    const results = await prisma.Orders.findUnique({
        where: {id: randomConfirmation}
    })

    if (results) return getConfirmationNumber()
    return randomConfirmation
}


export default async function addOrder (C_Data, P_Data) {
    const orderPhoneValid = phoneSchema.safeParse(C_Data.orderPhone).success
    const orderEmailValid = emailSchema.safeParse(C_Data.orderEmail).success
    const receiverNameValid = nameSchema.safeParse(C_Data.receiverName).success
    const receiverPhoneValid = C_Data.receiverPhone?phoneSchema.safeParse(C_Data.receiverPhone).success:true
    const addressValid = addressSchema.safeParse(C_Data.address).success
    const extraAddressValid = C_Data.extraAddress?addressSchema.safeParse(C_Data.extraAddress).success:true
    const governmentValid = C_Data.government.length < 20 && C_Data.government in governsData
    const cityValid = governmentValid? C_Data.city.length < 20 && governsData[C_Data.government].includes(C_Data.city): false


    if (orderPhoneValid && orderEmailValid && receiverNameValid && receiverPhoneValid && addressValid && extraAddressValid
        && governmentValid && cityValid) {
        const newOrder = await prisma.Orders.create({
            data: {
                id: await getConfirmationNumber(),
                ownerEmail: C_Data.orderEmail,
                ownerPhone: C_Data.orderPhone,
                receiverName: C_Data.receiverName,
                ...(C_Data.differentReceiver? {
                    differentReceiver: true,
                    receiverPhone: C_Data.receiverPhone,
                }: {}),
                receiverGovernment: C_Data.government,
                receiverCity: C_Data.city,
                receiverAddress: C_Data.address,
                products: P_Data,
                ...(C_Data.extraAddress? {receiverExtraAddress: C_Data.extraAddress}: {})
            }
        })

        return newOrder.id
    }

    return false

}