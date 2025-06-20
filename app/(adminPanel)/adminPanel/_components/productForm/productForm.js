"use client"

import styles from './page.module.css'
import * as React from 'react';
import { addProduct, updateProduct } from '../../_actions/productActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

export default function ProductForm({categories, product}) {
  const [state, formAction, pending] = React.useActionState(product ? updateProduct : addProduct, {message: ''})
  
  return (
  <form action={formAction}>
      <h3>Product infromation</h3>
      <TextField name="name" label="Product Name" variant="filled" defaultValue={product && product.name} required/>

      <div className={styles.imgsLayout}>

        <div className={styles.leftPartLayout}>
          <div className={styles.selectCont}>
              <p>What is this product for</p>  
              <MultipleSelectCheckmarks categories={categories} defaultCat={product?.categories}/>
          </div>

          <div className={styles.priceCont}>
            <TextField name="price" label="Price in EGP" variant="filled" fullWidth type="number"
            defaultValue={product && product.price} helperText='After discount' required/>

            <TextField name="discount" label="Discount percentage" variant="filled" fullWidth type="number" helperText='Not required'
            defaultValue={product?.discount ? product.discount : 0}/>

            <TextField name="quantity" label="Initial quantity" variant="filled" fullWidth type="number"
            defaultValue={product?.quantity ? product.quantity : 1}/>
          </div>

          <TextField name="description" label="Product Description" multiline  variant="filled"  minRows={5}
          defaultValue={product?.description && product.description}/>
        </div>
        <div>
          <ImgsCont defaultImages={product?.imagePaths || []}/>
        </div>
        
      </div>

      <Button type="submit" variant="contained" color="primary" disabled={pending}>
      {pending? `The category is being ${product?"updated":"added"}` : (product?"Update this product":"Add new product")}</Button>

      {product && <input name="id" value={product.id} readOnly hidden></input>}
  </form>
  )
}



export function MultipleSelectCheckmarks({categories, defaultCat}) {
  const [selectedIds, setSelectedIds] = React.useState(defaultCat || []);

  const handleChange = (event) => {
    const {target: { value }} = event;
    setSelectedIds(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <FormControl fullWidth variant="filled" >
        <InputLabel id="demo-multiple-checkbox-label">Select Category/s</InputLabel>
        <Select
            name="productCategories"
            labelId="demo-multiple-checkbox-label"
            multiple
            value={selectedIds}
            onChange={handleChange}
            renderValue={(selected) => 
                categories
                .filter((c) => selected.includes(c.id))
                .map((c) => c.name)
                .join(', ')
            }
            required
        >
        {categories.map((v) => (
            <MenuItem key={v.id} value={v.id} sx={{ padding: '2px 8px'}}>
                <Checkbox checked={selectedIds.includes(v.id)} />
                <ListItemText primary={`${v.name} / ${v.section}`}/>
            </MenuItem>
        ))}
        </Select>
    </FormControl>
  );
}


export function ImgsCont ({defaultImages}) {
  const [refs] = React.useState([React.useRef(null), React.useRef(null), React.useRef(null), React.useRef(null)])
  const [imgsPathes, setImgsPathes] = React.useState([...defaultImages])
  const [removedPathes, setRemovedPatehs] = React.useState([])
  const [inputKeys, setInputKeys] = React.useState([ 0,  1,  2,  3 ])

  const rmInput = (index)=>{
    setInputKeys(prev => prev.filter((_, i)=> i != index))

    // new one
    setInputKeys((prev) => [...prev, Math.random()])
  }

  // tracking removed images files when updating a product
  React.useEffect(()=> {
    const arr = defaultImages.filter((v)=> !imgsPathes.includes(v))
    setRemovedPatehs(arr)
  }, [imgsPathes])

  return (
    <div className={styles.imgsCont}>
      {inputKeys.map((v, i)=> {
        return <ImgInput key={v} refs={refs} ref={refs[i]} imgsPathes={imgsPathes} setImgsPathes={setImgsPathes} removeInput={rmInput} required={i==0 && true}/>
      })}
      {defaultImages.length > 0 && <input name="removedImages" value={JSON.stringify(removedPathes)} readOnly hidden/>}
    </div>
  )
}

export function ImgInput ({refs, ref, imgsPathes, setImgsPathes, removeInput, required}) {
  const maxImageSize = 1
  const index = refs.indexOf(ref)
  const order = ['First', 'Second', 'Third', 'Fourth'][index]
  const inputId = order+index
  const [isFile, setIsFile] = React.useState(null)


  const openCorrectInput = (event) => {
    if (index>0 && refs[index-1].current.value == "" && !imgsPathes[index-1]) {
      event.preventDefault()
      refs[index-1].current.click()
    }
  }
  
  const handleFileChange = (event) => {
    if (event.target.value == "") {
      setImgsPathes(prev=> prev.filter((_, i)=> i != index))
      return removeInput(index)
    }
    const file = event.target.files[0]

    const allowedTypes = ["image/jpeg", "image/png"];

    if (event.target.files[0].size > maxImageSize*1048576) {
      event.target.value = ""
      return alert(`Image file must be ${maxImageSize} MB or smaller`);
    }

    if (!allowedTypes.includes(file.type)) {
      event.target.value = ""
      return alert("Only JPG and PNG files are allowed!");
    }

    setImgsPathes((prev) => [...prev.slice(0, index), URL.createObjectURL(file), ...prev.slice(index+1)])
    setIsFile(true)
  };

  const removeImg = (event) => {
    event.preventDefault()
    setImgsPathes(prev=> prev.filter((_, i)=> i != index))
    removeInput(index)
  }

  return (
    <div className={styles.imageCont} style={imgsPathes[index] && {background:"none"}}>
 
      <label htmlFor={inputId} className={imgsPathes[index] && styles.labelHover}>
        {imgsPathes[index]?
         "Click anywhere to change" :
         `${order} image`}
        {!imgsPathes[index] && <span style={{color:"grey", fontSize:"12px"}}>Click to upload</span>}
        
        {imgsPathes[index] && <div className={styles.button} onClick={removeImg}>remove</div>}
      </label>
      
      {
        imgsPathes[index] &&
        <img src={imgsPathes[index]} alt="Preview image"/>
      }

      { !isFile && imgsPathes[index] && <input name="image" id={inputId+"/path"} value={imgsPathes[index]} readOnly hidden/> }
      <input name={isFile? "image": null} type="file" id={inputId} onChange={handleFileChange} ref={ref} onClick={openCorrectInput} required={(!isFile && !imgsPathes[index]) && required}/>
    </div>
  )
}