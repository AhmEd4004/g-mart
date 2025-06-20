"use server"

export default async function getQuantity(id) {
    return await prisma.Products.findUnique({
        where: {id},
        select: {quantity: true}
    })
}