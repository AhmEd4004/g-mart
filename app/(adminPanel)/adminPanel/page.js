import { prisma } from "@/libs/prisma";
import AdminHome from "./adminPanel";
import { auth } from "@/app/api/auth/[...nextauth]/route";;

export default async function page () {
  const session = await auth()
  const [categories, products, orders] = await Promise.all([
    prisma.Categories.count(),
    prisma.Products.count(),
    prisma.Orders.count({where: {process: 'delivered'}})
  ])

  return (
    <AdminHome analytics={{categories, products, orders}} adminName={session.user.name}/>
  )
}