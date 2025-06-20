"use server"

import { prisma } from "@/libs/prisma"

export async function updateOrder(id, name, data) {
    await prisma.Orders.update({
        where: {
            id
        },
        data: {[name]: data}
    })
}

export async function removeOrder(id) {
    await prisma.Orders.delete({
        where: {
            id
        }
    })
}