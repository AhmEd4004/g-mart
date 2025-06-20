import styles from './page.module.css'
import { SquarePlus } from 'lucide-react'
import Navigator from "../_components/navigator/navigator";
import ProductForm from '../_components/productForm/productForm';
import { prisma } from '@/libs/prisma';


export default async function page() {
    const categories = await prisma.categories.findMany ({orderBy: {
        createdAt: 'desc',
    }})
    return (
        <div className={styles.frame}>
            <Navigator  last={{"Home": "/adminPanel"}} current={"Add Product"}><SquarePlus size={20}/></Navigator>
            <ProductForm categories={categories}/>
        </div>
    )
}