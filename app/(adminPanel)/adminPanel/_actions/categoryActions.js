"use server"
import fs from 'fs/promises'
import { redirect } from 'next/navigation'
import { prisma } from "@/libs/prisma";


const imgsDir = 'public/files/categoriesImages'
await fs.mkdir (imgsDir, {recursive: true})

const uploadImage = async (imgFile) =>{
  const imageName = `${crypto.randomUUID()}-${imgFile.name}`
  const imagePath = `${imgsDir}/${imageName}`
  try {
    await fs.writeFile(imagePath, Buffer.from(await imgFile.arrayBuffer()))
  } catch (err) {
    console.log(err)
    return {err}
  }
  return imageName
}


const updateImage = async (oldImgPath, newImg) => {
  // deleteing the old image
  const rootFile = "public"
  try {
    await fs.unlink(rootFile+oldImgPath)
  } catch (err) {
    console.log(err)
  }

  // updating the new image
  return await uploadImage (newImg)
}


export async function addCategory(prevState, formData) {
    // validations
    const {name, section, image} = Object.fromEntries(formData.entries())

    // validate if it exist before
    const category = await prisma.categories.findUnique ({
      where: {
        name_section: {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          section: section.charAt(0).toUpperCase() + section.slice(1)
        }
      }
    })

    if (category) {
      return {err: {
        name: `This category name already exists in section ${section}`
      }}
    }

    // updating and uploading the image
    const imageName = await uploadImage(image)
    if (imageName.err) return {err: {image: "there is an error happened while uploading the image"}}
    
    await prisma.categories.create({
        data: {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            section: section,
            imagePath: "/files/categoriesImages/"+imageName,
        },
    })
    redirect('/adminPanel')
}

export async function updateCategory (prevState, formData) {
  
  // validations
  const {id, imagePath, name, section, image} = Object.fromEntries(formData.entries())
  
  const updatedData = {
    name,
    section
  }

  // deleting old photo and updating the new one if it is exist
  if (image.size > 0) {
    const newImageName = await updateImage (imagePath, image)
    if (newImageName.err) return {err: {image: "there is an error happened while uploading the image"}}
    updatedData.imagePath = "/files/categoriesImages/"+newImageName
  }
  

  await prisma.Categories.update({
    where: {
       id
     },
    data: updatedData,
  })

  redirect('/adminPanel/categoriesList')
}