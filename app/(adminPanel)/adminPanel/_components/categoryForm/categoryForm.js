"use client"

import { useState, useActionState  } from "react";
import styles from './page.module.css'
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
import Image from "next/image";
import * as actions from "../../_actions/categoryActions";


export default function CategoryForm({category}) {
    const action = category? actions.updateCategory:actions.addCategory
    const [state, formAction, pending] = useActionState(action, {message: ''})
    const maxImageSize = 1

    const [filePath, setFilePath] = useState(category?.imagePath);
    const [sizeLocalErr, setSizeLocalErr] = useState(null);

    const handleFileChange = (event) => {
    if (event.target.value == 0) return
        const file = event.target.files[0]
        const allowedTypes = ["image/svg+xml", "image/png"];

        if (event.target.files[0].size > maxImageSize*1048576) {
            event.target.value = ""
            return setSizeLocalErr(`Image file must be ${maxImageSize} MB or smaller`)
        }

        if (!allowedTypes.includes(file.type)) {
            event.target.value = ""
            return setSizeLocalErr("Only JPG and PNG files are allowed!")
        }

        setSizeLocalErr(null)   
        setFilePath(URL.createObjectURL(file))
    };
    
    return (
    <form action={formAction}>
        <h3>Category information</h3>
        <TextField name="name" label="Category Name" variant="filled" defaultValue={category?.name} required
        helperText={state?.err?.name ? state.err.name : ''} error={state?.err?.name? true:false}/>
        <FormControl variant="filled" fullWidth>
            <InputLabel id="demo-simple-select-label">Category section</InputLabel>
            <Select
                name="section"
                labelId="demo-simple-select-label"
                defaultValue={category?category.section:""}
                required
            >
                <MenuItem value={'Men'}>Men accessories</MenuItem>
                <MenuItem value={'Women'}>Women accessories</MenuItem>
                <MenuItem value={'Home'}>Home decoration</MenuItem>
                <MenuItem value={'Others'}>others</MenuItem>
            </Select>
        </FormControl>

        <FormControl error={sizeLocalErr}>
        <div className={styles.fileInputCont}>
            <span>Click to upload the category image</span>
            <label htmlFor="upload-button"> 
                <Button variant="contained" component="span">
                Upload Image
                <input name="image" type="file" onChange={handleFileChange} id="upload-button" required={!category} accept=".png, .svg"/>
                </Button>
            </label>
        </div>
        <FormHelperText>{sizeLocalErr || `Image must be of SVG or PNG type with ${maxImageSize} MB maximum size` }</FormHelperText>
        </FormControl>
        {
            filePath &&
            <div className={styles.imgPreviewCont}>
                <Image src={filePath} fill style={{ objectFit: 'contain' }} alt="Preview image"/>
            </div>
        }
        <Button type="submit" variant="contained" color="primary" disabled={pending}>
        {pending? `The category is being ${category? 'updated': 'added'}` : (category?"Update this category":"Add new category")}</Button>
        {category && <input name="id" value={category.id} readOnly hidden></input>}
        {category && <input name="imagePath" value={category.img} readOnly hidden></input>}
    </form>
    )
}