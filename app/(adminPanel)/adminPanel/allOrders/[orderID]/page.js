import { prisma } from "@/libs/prisma"
import OrderPage from "./orderPage"

export default async function page ({params}) {
    const {orderID} = await params
    const order = await prisma.Orders.findUnique({
        where: {id: orderID}
    })
    const orderProducts = await prisma.Products.findMany({
        where: {
            id: {in: Object.keys(order.products)}
        }
    })
    return (
        <OrderPage order={order} orderProducts={orderProducts}/>
    )
}