import styles from './page.module.css'
import { SquarePlus } from 'lucide-react'
import Navigator from "../_components/navigator/navigator";
import CategoryForm from '../_components/categoryForm/categoryForm';


export default function page() {
    
    return (
        <div className={styles.frame}>
            <Navigator last={{"Home": "/adminPanel"}} current={"Add Category"}><SquarePlus size={20}/></Navigator>
            <CategoryForm/>
        </div>
    )
}