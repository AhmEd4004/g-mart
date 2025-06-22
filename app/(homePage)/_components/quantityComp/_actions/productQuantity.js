"use server"
import { prisma } from "@/libs/prisma"

export default async function getQuantity(id) {
    return await prisma.Products.findUnique({
        where: {id},
        select: {quantity: true}
    })
}