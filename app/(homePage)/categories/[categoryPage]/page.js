import Product from "@/app/(homePage)/categories/[categoryPage]/_productComp/product";
import styles from "./page.module.css";
import { prisma } from "@/libs/prisma";

export default async function categories({ params }) {
  const {categoryPage} = await params
  const paramsArr = categoryPage.split("-")
  const [section, categoryName] = [paramsArr[0].charAt(0).toUpperCase() + paramsArr[0].slice(1), paramsArr[1].charAt(0).toUpperCase() + paramsArr[1].slice(1)]
  const categoryItem = await prisma.Categories.findUnique({
    where:{
      name_section: {
        name: categoryName,
        section: section
      }
    }
  })
  if (categoryItem) {
    const allProducts = await prisma.Products.findMany({
      where:{
        categories: {
          has: categoryItem.id
        }
      }
    })
    return (
      <>
      <h3>{`${categoryName} - ${section}`}</h3>
      <div className={styles.productsFrame}>
        {allProducts.map ((v)=> {
          return <Product
            Product
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
      </div>
      </>
    );
  }
  
  return (
    <div>This category might not exist or still under development.</div>
  );
}
