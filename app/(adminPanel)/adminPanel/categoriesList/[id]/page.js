import styles from './page.module.css'
import CategoryForm from "../../_components/categoryForm/categoryForm"
import Navigator from "../../_components/navigator/navigator"
import { Pencil } from 'lucide-react'
import { prisma } from '@/libs/prisma'

export default async function page ({params}) {
    const {id} = await params
    const category = await prisma.Categories.findUnique ({
        where: {id: id}
    })
    return (
        <div className={styles.frame}>
            <Navigator  last={{"Home": "/adminPanel", "Table": "/adminPanel/categoriesList"}} current={`Update ${category.name}`}>
            <Pencil size={20}/></Navigator>
            <CategoryForm category={category}/>
        </div>
    )
}