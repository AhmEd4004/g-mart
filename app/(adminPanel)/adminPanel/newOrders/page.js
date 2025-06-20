import { prisma } from "@/libs/prisma";
import DataTable from "../_components/ordersTable/dataTable";

export default async function page () {
    const newOrders = await prisma.Orders.findMany({
        where:{process: 'acceptance'},
        orderBy: {createdAt: 'desc'},
    })
    
    const formatedData = newOrders.map(v=> ({
        id: v.id,
        location: [v.receiverGovernment, v.receiverCity],
        contact: [v.ownerEmail, v.ownerPhone],
        date: v.createdAt.toLocaleString('en-US', {
            weekday: 'short',month: 'short',day: 'numeric',hour: '2-digit',minute: '2-digit',
        }),
        products: v.products
    }))
    return (
        <DataTable rows={formatedData} newOrdersT={true}/>
    )
}