import { prisma } from '@/libs/prisma';
import ProductsTable from './_components/components';


export default async function page() {
  const rows = await prisma.Products.findMany ({orderBy: {createdAt: 'desc',}})
  const categories = await prisma.Categories.findMany ()
  const categoryLookup = categories.reduce((lookup, category) => {
    lookup[category.id] = category.name+" - "+category.section; 
    return lookup;
  }, {});


  const modifiedRows = rows.map(row => ({
    id: row.id,
    name: row.name,
    price: row.price,
    categoriesIds: row.categories,
    categories: row.categories.map(catId => categoryLookup[catId]),
    image: row.imagePaths[0],
    quantity: row.quantity,
    availability: row.availability
  }));
  return (
    <ProductsTable rows= {modifiedRows} />
  );
}