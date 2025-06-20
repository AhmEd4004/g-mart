"use server"
import fs from 'fs/promises'
import { prisma } from "@/libs/prisma";

export async function deleteProduct (ids) {
    // getting the data again from DB to validatie it
    const products = await prisma.Products.findMany ({
        where: {
            id: { in: ids },
        }
    })

    // deleting files
    
    const rootFile = "public"
    const ids_toDelete = []
    await Promise.all(products.map(async (v) => {
        try {
            for (const img of v.imagePaths) {
                await fs.unlink(rootFile+img)
            }
            ids_toDelete.push(v.id)
        } catch (err) {
            console.error('Error deleting the file:', err);
        }
    }))

    // deleting records
    if (ids_toDelete.length == 0) return 'No images have been deleted'
    await prisma.Products.deleteMany ({
        where: {
            id: { in: ids_toDelete },
        }
    })
}

export async function changeProductAvailability(ids, availability) {
    const promises = ids.map(id =>
        prisma.Products.update({
          where: { id },
          data: { availability: availability },
        })
      );

    await Promise.all(promises)
}