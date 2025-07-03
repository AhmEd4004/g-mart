import { prisma } from "@/libs/prisma";
import ProductPage from "./ProductPage";
import { redirect } from "next/navigation";

export default async function product({ params }) {
  const {productID} = await params
  try {
    const product = await prisma.Products.findUnique({
      where: {
        id: productID
      }
    })
    return (
      <ProductPage product={product}/>
    )
  } catch {
    return redirect('/notfound')
  }
  
}