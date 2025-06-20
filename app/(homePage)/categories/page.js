import { prisma } from "@/libs/prisma";
import Categories from "./categoriesPage";

export default async function page() {
    const data = await prisma.Categories.findMany()
    const availableCategories = []
    for (let i=0; i<data.length; i++){
        const count = await prisma.Products.count({
            where: {
                categories: { has: data[i].id },
                availability: true
            }
        })

        if (count > 0) availableCategories.push(data[i])
    }

    return (   
        <Categories allCategories={availableCategories}/>
    )
}