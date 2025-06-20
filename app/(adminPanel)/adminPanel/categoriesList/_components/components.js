"use client"

import styles from './page.module.css'
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Image from 'next/image';
import { Button } from '@mui/material';
import Link from 'next/link';
import { deleteCategory } from '../_actions/actions';
import { useRouter } from 'next/navigation';
import Navigator from '../../_components/navigator/navigator';
import { LayoutList } from 'lucide-react';


function ImageComponent ({src}) {
  return (
  <div className={styles.imgMainCont} >
    <div className={styles.imgCont}>
      <Image src={src} fill style={{ objectFit: 'contain' }} alt="Category Image"></Image>
    </div>
  </div>
  )
}

const columns = [
    {
      field: 'imagePath', headerName: 'Category image', flex: 2,
      sortable: false,
      renderCell: (params) => (
        <ImageComponent src={params.value}/>
      )
    },
    { field: 'name', headerName: 'Name', flex: 3 },
    { field: 'section', headerName: 'Section', flex: 3 },
];

const paginationModel = { page: 0, pageSize: 6 };

export default function CategoriesTable({rows}) {
  const router = useRouter()
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [disableDelete, setDisableDelete] = React.useState(false)

  const handleSelectionChange = (ids) => {
    setSelectedItems(ids);
  };

  const deleteButtonFunction = async() => {
    if (window.confirm ('Are you sure you want to remove the selected itms')) {
      setDisableDelete(true)
      const message = await deleteCategory(selectedItems)
      if (message) alert(message)
      router.refresh()
      setDisableDelete(false)
    }
  }

  const goToUpdate = ()=> {
    router.push("/adminPanel/categoriesList/"+selectedItems[0])
  }
  return (
    <div className={styles.frame}>
      <Navigator  last={{"Home": "/adminPanel"}} current={"Categories Table"}>
        <LayoutList size={20}/>
        <Link href="/adminPanel/addCategory" className={styles.addNewLink}>+ Add new category</Link>
      </Navigator>
      <div className={styles.tableCont}>
        <Paper sx={{ width: '100%', minWidth: 800 }}>
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[6, 10]}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
            rowHeight={70}
            sx={{ border: 0 }}
        />
        </Paper>
      </div>
      <div className={styles.actionsCont}>
        <Button variant="contained" color={'error'} onClick={deleteButtonFunction} disabled={selectedItems.length == 0 || disableDelete}>Delete Selected</Button>
        <Button variant="contained" color={'success'} disabled={selectedItems.length != 1} onClick={goToUpdate}>Update Selected</Button>
      </div>
    </div>
  );
}