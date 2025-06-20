import { prisma } from '@/libs/prisma';
import CategoriesTable from './_components/components';


export default async function page() {
  const rows = await prisma.Categories.findMany ({orderBy: {createdAt: 'desc'}})
  return (
    <CategoriesTable rows= {rows} />
  );
}