"use client"

import styles from './page.module.css'
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Navigator from '../navigator/navigator';
import { LayoutList } from 'lucide-react';
import { Button } from '@mui/material';
import {acceptOrder, removeOrder} from '../../_actions/orderActions';
import { useRouter } from 'next/navigation';

const statusClrs = {delivered: '#22bb33', rejected: '#bb2124', shipping: '#5bc0de', acceptance:'#5bc0de'}

export default function DataTable({rows, newOrdersT=false}) {

  const columns = [
    { field: 'date', headerName: 'Order Date', flex: 0.8,
      renderCell: (params) => (
        <p className={styles.dateCont}>{params.value}</p>
      )
    },
    { field: 'location', headerName: 'Location', flex: 0.8, sortable: false,
      renderCell: (params) => (
        <div className={styles.twoLineCont}><p>{params.value[0]}</p><p>{params.value[1]}</p></div>
      )
    },
    { field: 'contact', headerName: 'Contact (Email / Phone)', flex: 1.5, sortable: false,
      renderCell: (params) => (
        <div className={styles.twoLineCont}><p>{params.value[0]}</p><p>{params.value[1]}</p></div>
      )
    },
    { field: 'products', headerName: 'Products', flex: 2, sortable: false,
      renderCell: (params) => (
        <div className={styles.twoLineCont}>
          {Object.keys(params.value).slice(0,2).map(v=>{
            return <div key={v} className={styles.productsCont}><p>{params.value[v].name}</p> <span>{params.value[v].quantity}</span></div>
          })}
          {Object.keys(params.value).length > 2 && <p>... {Object.keys(params.value).length-2} more</p>}
        </div>
      )
    },
    (!newOrdersT?{ field: 'process', headerName: 'Status', flex: 0.6,
      renderCell: (params) => (
        <p style={{color:statusClrs[params.value]}}>{params.value}</p>
      )
    }:null)
  ].filter(Boolean)


  const router = useRouter()
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [disableButtons, setDisableButtons] = React.useState(false)

  const confirmOrderF = async () => {
    if ( !window.confirm('By accepting the selected orders, they will move to the shopping phase. Continue?') ) return
    setDisableButtons(true)
    await acceptOrder(selectedItems, true)
    window.location.reload()
  }

  const rejectOrderF = async () => {
    if ( !window.confirm('Are you sure you want to reject selected order(s)?') ) return
    setDisableButtons(true)
    await acceptOrder(selectedItems, false)
    window.location.reload()
  }

  const removeOrderF = async () => {
    if ( !window.confirm('Are you sure you want to totally remove selected order(s)?') ) return
    setDisableButtons(true)
    await removeOrder(selectedItems)
    window.location.reload()
  }

  const handleSelectionChange = (ids) => {
    setSelectedItems(ids);
  };

  return (
    <div className={styles.frame}>
      <Navigator  last={{"Home": "/adminPanel"}} current={newOrdersT?"New Orders":"All Orders"}>
          <LayoutList size={20}/>
      </Navigator>
      <div className={styles.tableCont}>
        <Paper sx={{ height: '100%', width: '100%', minWidth: 800 }}>
        <DataGrid
            rows={rows}
            columns={columns}
            pagination={false}
            hideFooter={true}
            checkboxSelection
            rowHeight={70}
            onRowSelectionModelChange={handleSelectionChange}
            sx={{ border: 0,
              '& .MuiDataGrid-cell': {fontSize: '13px'},
            }}
        />
        </Paper>     
      </div> 
      <div className={styles.actionsCont}>
        <div style={{flex:'1', display:'flex', gap:'8px'}}>
          <p>{rows.length} items</p>
          {selectedItems.length>0 && <p> - {selectedItems.length} selected items</p>}
        </div>
        {newOrdersT && <Button variant="contained" color={'success'} disabled={selectedItems.length == 0 || disableButtons} onClick={confirmOrderF}>Accept</Button>}
        <Button variant="contained" color={'error'} disabled={selectedItems.length == 0 || disableButtons} onClick={removeOrderF}>Remove</Button>
        <Button variant="contained" color={'error'} disabled={selectedItems.length == 0 || disableButtons} onClick={rejectOrderF}>Reject</Button>
        <Button variant="contained" disabled={selectedItems.length != 1} onClick={()=>{router.push("/adminPanel/allOrders/"+selectedItems[0])}}>Review & Edit</Button>
      </div>
    </div>
  );
}
