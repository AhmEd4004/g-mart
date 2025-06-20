"use server"
import { prisma } from "@/libs/prisma"

export async function acceptOrder(orderIDs, acceptance) {
    await prisma.Orders.updateMany({
        where: {
            id: {in: orderIDs}
        },
        data: {
            process: acceptance? "shipping": 'rejected'
        }
    })
}

export async function removeOrder(orderIDs) {
    await prisma.Orders.deleteMany({
        where: {
            id: {in: orderIDs}
        },
    })
}