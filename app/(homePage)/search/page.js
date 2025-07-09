import styles from "./page.module.css";
import { prisma } from "@/libs/prisma";
import Product from "@/app/(homePage)/categories/[categoryPage]/_productComp/product";
import { Suspense } from "react";

export default async function page({searchParams}) {
  const params = await searchParams
  return (
    <Suspense fallback={<p>Loading search results...</p>}>
      <SearchResults params={params}/>
    </Suspense>
  )
}

async function SearchResults ({params}) {

  const name = Array.isArray(params.name) ? params.name[0] : (params.name || '')
  const section = Array.isArray(params.section) ? params.section[0] : (params.section || null)
  const startPrice = Array.isArray(params.startPrice) ? params.startPrice[0] : (params.startPrice || null)
  const endPrice = Array.isArray(params.endPrice) ? params.endPrice[0] : (params.endPrice || null)
  const sortByLowestPrice = Array.isArray(params.sortByLowestPrice) ? params.sortByLowestPrice[0] : (params.sortByLowestPrice || null)

  const searchKeyWords = name.split('-')

  const nameFilters = searchKeyWords.filter(keyword => keyword.trim() !== '')
  .map(keyword=> ({name: { contains: keyword, mode: 'insensitive' }}))

  let sectionFilter = false
  const validSectionValues = ['men', 'women', 'other']
  if (section && validSectionValues.includes(section)) {
    const categories = await prisma.Categories.findMany({
      where: {
        ...(section!='other'? {section: {equals: section, mode: 'insensitive'}}:
          {section: {notIn: ['men', 'women'], mode: 'insensitive'}})
        
      }
    })

    sectionFilter = categories.map(v=> v.id)
  }

  const allProducts = await prisma.Products.findMany({
      where:{
          OR: nameFilters,
          price: { gte: startPrice? Number(startPrice) : 0, ...(endPrice? {lte: Number(endPrice)}:{}) },
          ...(sectionFilter? {categories: {hasSome: sectionFilter}}: {}),
      },
      ...(sortByLowestPrice? {orderBy: { price: 'asc' }} : {})
    })

  return (
      <>
      <h3>Search results</h3>
      <div className={styles.productsFrame}>
        {allProducts.map ((v)=> {
          return <Product
            key={v.id}
            id = {v.id}
            title={v.name}
            price={v.price}
            priceBefore={Math.round(v.price/(1-v.discount/100))}
            discount={v.discount}
            descri={v.description}
            imgSrc={v.imagePaths[0]}
          />
        })}
        {allProducts.length == 0 &&
        <div className={styles.noResults}>
          <img src='search.svg'/>
          No results for your search!
        </div>}
        </div>
      </>
  )
}