"use server"
import fs from 'fs/promises'
import { redirect } from 'next/navigation'
import { prisma } from "@/libs/prisma";


const imgsDir = 'public/files/productsImages'
await fs.mkdir (imgsDir, {recursive: true})

const uploadImage = async (imgFile) =>{
  const imageName = `${crypto.randomUUID()}-${imgFile.name}`
  const imagePath = `${imgsDir}/${imageName}`
  try {
    await fs.writeFile(imagePath, Buffer.from(await imgFile.arrayBuffer()))
  } catch (err) {
    return {err}
  }
  return imageName
}


export async function addProduct (prevState, formData) {
  const data = Object.fromEntries(formData.entries())
  const images = formData.getAll('image')

  // creating Images
  let createdImages = []
  for (let i=0; i<images.length; i++) {
    const image = images[i]
    if (image.size == 0) continue
    const imgName = await uploadImage(image)
    if (imgName.err) continue
    createdImages.push("/files/productsImages/"+imgName)
  }

  if (createdImages.length > 0) {
    await prisma.Products.create ({
        data: {
          name: data.name,
          description: data.description,
          price: Number(data.price),
          discount: Number(data.discount),
          imagePaths: createdImages,
          categories: data.productCategories.split(","),
          quantity: Number(data.quantity)
        }
    })
      
    redirect('/adminPanel')
  }
}

export async function updateProduct (prevState, formData) {
  const data = Object.fromEntries(formData.entries())
  const images = formData.getAll('image')

  const rootFile = "public"
  const removedPathes = JSON.parse(data.removedImages)
  await Promise.all(removedPathes.map(async (pathName) => {
      try {
        await fs.unlink(rootFile+pathName)
      } catch (err) {
        console.error('Error deleting the file:', err);
      }
  }))

  let imagePaths = []
  for (let i=0; i<images.length; i++) {
    const image = images[i]
    if (image instanceof File) { // If not then there is no file sent, it should be a path for an old uploaded image
      if (image.size == 0) continue
      const imgName = await uploadImage(image)
      if (imgName.err) continue
      imagePaths.push("/files/productsImages/"+imgName)
    } else if (typeof image === 'string') {
      imagePaths.push(image)
    }
  }

  await prisma.Products.update ({
    where: {
      id: data.id
    },
    data: {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      discount: Number(data.discount),
      imagePaths,
      categories: data.productCategories.split(","),
      quantity: Number(data.quantity)
    }
  })
      
  redirect('/adminPanel/productsList')
}