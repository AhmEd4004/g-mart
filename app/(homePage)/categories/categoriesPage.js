import styles from "./page.module.css";
import CategoryItem from "@/app/(homePage)/categories/_categoryComponent/categoryItem";
import SelectCategory from "@/app/(homePage)/categories/_selectComponent/selectCategory";

export default function Categories({allCategories}) {
  const menCategories = allCategories.filter(v=> v.section == "Men")
  const womenCategories = allCategories.filter(v=> v.section == "Women")
  const homeCategories = allCategories.filter(v=> v.section == "Home")
  const othersCategories = allCategories.filter(v=> v.section == "Others")
  const availableSections = {
    men: menCategories.length > 0,
    women: womenCategories.length > 0,
    home: homeCategories.length > 0,
    others: othersCategories.length > 0,
  }
  return (
    <>
      <h2>Explore variety of gifts</h2>
      <SelectCategory available={availableSections}></SelectCategory>
      <div className={styles.CategoriesFrame}>
        {menCategories.length > 0 && <h3 id="menSection">Men accessories</h3>}
        
        {menCategories.map((v) => {
          return <CategoryItem imgSrc={v.imagePath} categoryName={v.name} key={v.id} section={"men"}></CategoryItem>
        })}

        {womenCategories.length > 0 && <h3 id="womenSection">Women accessories</h3>}
        
        {womenCategories.map((v) => {
          return <CategoryItem imgSrc={v.imagePath} categoryName={v.name} key={v.id} section={"women"}></CategoryItem>
        })}

        {homeCategories.length > 0 && <h3 id="homedecSection">Home decoration</h3>}
        
        {homeCategories.map((v) => {
          return <CategoryItem imgSrc={v.imagePath} categoryName={v.name} key={v.id} section={"home"}></CategoryItem>
        })}

        {othersCategories.length > 0 && <h3 id="othersSection">Others</h3>}
        
        {othersCategories.map((v) => {
          return <CategoryItem imgSrc={v.imagePath} categoryName={v.name} key={v.id} section={"others"}></CategoryItem>
        })}

      </div>
    </>
  );
}
