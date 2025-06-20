import styles from './page.module.css'
import Navigator from "../../_components/navigator/navigator"
import { Pencil } from 'lucide-react'
import { prisma } from '@/libs/prisma'
import ProductForm from '../../_components/productForm/productForm'

export default async function page ({params}) {
    const {id} = await params
    const product = await prisma.Products.findUnique ({
        where: {id: id}
    })
    const categories = await prisma.Categories.findMany()
    return (
        <div className={styles.frame}>
            <Navigator  last={{"Home": "/adminPanel", "Table": "/adminPanel/productsList"}} current={`Update product`}>
            <Pencil size={20}/></Navigator>
            <ProductForm categories={categories} product={product}/>
        </div>
    )
}