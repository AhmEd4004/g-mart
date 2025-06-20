"use client"

import styles from './page.module.css'
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Image from 'next/image';
import { Button } from '@mui/material';
import Link from 'next/link';
import { changeProductAvailability, deleteProduct } from '../_actions/actions';
import Navigator from '../../_components/navigator/navigator';
import { LayoutList } from 'lucide-react';
import { useRouter } from 'next/navigation';


function ImageComponent ({src}) {
  return (
  <div className={styles.imgMainCont} >
    <div className={styles.imgCont}>
      <Image src={src} fill style={{ objectFit: 'contain' }} alt="Product Image"></Image>
    </div>
  </div>
  )
}

const columns = [
    {
      field: 'image', headerName: 'Product image', flex: 1.2, sortable: false,
      renderCell: (params) => (
        <ImageComponent src={params.value}/>
      )
    },
    { 
      field: 'name', headerName: 'Name', flex: 2,
      renderCell: (params) => (
        <div className={styles.nameCont}>
          {params.value}
        </div>
      )
    },
    { 
      field: 'categories', headerName: 'Categories', flex: 1.2, sortable: false,
      renderCell: (params) => (
        <div className={styles.categoriesCont}>
          {params.value.map ((v) => <p key={v}>{v}</p>)}
        </div>
      )
    },
    { field: 'price', headerName: 'Price', flex: 0.8 },
    { field: 'quantity', headerName: 'Quantity', flex: 0.8 },
    { 
      field: 'availability', headerName: 'Available', flex: 0.8,
      renderCell: (params) => (<div style={{color:params.value?'#222':'red'}}>{params.value?'Yes':'No'}</div>)
    }
];

const paginationModel = { page: 0, pageSize: 5 };

export default function ProductsTable({rows}) {
  const router = useRouter()
  
  const [selectedItems, setSelectedItems] = React.useState([])
  const [disableDelete, setDisableDelete] = React.useState(false)

  const handleSelectionChange = (ids) => {
    setSelectedItems(ids);
  };

  const deleteButtonFunction = async() => {
    if (window.confirm ('Are you sure you want to remove the selected products')) {
      setDisableDelete(true)
      const message = await deleteProduct(selectedItems)
      if (message) alert(message)      
      router.refresh()
      setDisableDelete(false)
    }
  }

  const goToUpdate = ()=> {
    router.push("/adminPanel/productsList/"+selectedItems[0])
  }

  const changeAvailabilityF = async (availability)=> {
    if (!window.confirm ('Are you sure you want to change the availability of selected products')) return
    setDisableDelete(true)
    const availabilities = selectedItems.map(v=> {
      return rows.find(obj=>obj.id==v).availability
    })
    await changeProductAvailability(selectedItems, availability)
    setDisableDelete(false)
    router.refresh()
  }

  return (
    <div className={styles.frame}>
      <Navigator  last={{"Home": "/adminPanel"}} current={"Products Table"}>
        <LayoutList size={20}/>
        <Link href="/adminPanel/addProduct" className={styles.addNewLink}>+ Add new product</Link>
      </Navigator>
      <div className={styles.tableCont}>
        <Paper sx={{ width: '100%', minWidth: 800 }}>
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
            rowHeight={80}
            sx={{ border: 0,
              '& .MuiDataGrid-cell': {fontSize: '13px'}, }}
        />
        </Paper>
      </div>
      <div className={styles.actionsCont}>
          <Button variant="contained" color={'error'} disabled={selectedItems.length == 0 || disableDelete} onClick={deleteButtonFunction}>Delete Selected</Button>
          <Button variant="contained" color={'success'} disabled={selectedItems.length != 1} onClick={goToUpdate}>Update Selected</Button>
          <Button variant="contained" disabled={selectedItems.length == 0 || disableDelete} onClick={()=>{changeAvailabilityF(true)}}>Set available</Button>
          <Button variant="contained" color={'error'} disabled={selectedItems.length == 0 || disableDelete} onClick={()=>{changeAvailabilityF(false)}}>Set unavailable</Button>
      </div>
    </div>
  );
}