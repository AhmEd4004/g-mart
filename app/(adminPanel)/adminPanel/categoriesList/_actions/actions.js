"use server"
import fs from 'fs/promises'
import { prisma } from "@/libs/prisma";

export async function deleteCategory (ids) {

    // getting the data again from DB to validatie it
    const categories = await prisma.Categories.findMany ({
        where: {
            id: { in: ids },
        }
    })

    // deleting files
    
    const rootFile = "public"
    const ids_toDelete = []
    await Promise.all(categories.map(async (v) => {
            try {
                await fs.unlink(rootFile+v.imagePath)
                ids_toDelete.push(v.id)
            } catch (err) {
                console.error('Error deleting the file:', err);
            }

        }))

    // deleting records
    if (ids_toDelete.length == 0) return 'No files has been deleted'
    await prisma.Categories.deleteMany ({
        where: {
            id: { in: ids_toDelete },
        }
    })
}