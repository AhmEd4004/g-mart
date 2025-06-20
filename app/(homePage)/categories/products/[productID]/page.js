import { prisma } from "@/libs/prisma";
import ProductPage from "./ProductPage";

export default async function product({ params }) {
  const {productID} = await params
  const product = await prisma.Products.findUnique({
    where: {
      id: productID
    }
  })
  return (
    <ProductPage product={product}/>
  )
  
}