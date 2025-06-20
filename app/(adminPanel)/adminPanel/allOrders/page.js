import { prisma } from "@/libs/prisma";
import DataTable from "../_components/ordersTable/dataTable";

export default async function page () {
    const allOrders = await prisma.Orders.findMany({
        where: {process: {not: 'acceptance'}},
        orderBy: {createdAt: 'desc'},
    })
    
    const formatedData = allOrders.map(v=> ({
        id: v.id,
        location: [v.receiverGovernment, v.receiverCity],
        contact: [v.ownerEmail, v.ownerPhone],
        date: v.createdAt.toLocaleString('en-US', {
            weekday: 'short',month: 'short',day: 'numeric',hour: '2-digit',minute: '2-digit',
        }),
        products: v.products,
        process: v.process
    }))
    return (
        <DataTable rows={formatedData}/>
    )
}