import styles from './comp.module.css'
import * as React from 'react'
import { TriangleAlert } from 'lucide-react'

export default function UserError ({type='error', error, errorSetter}) {
    const contRef = React.useRef(null)
    React.useEffect (()=> {
        requestAnimationFrame(() => contRef.current.style.opacity = '1')
    }, [])
    React.useEffect(() => {
            const fadeoutTimer = setTimeout(() => {
                contRef.current.style.opacity = '0'
            }, 3600);
        if (error) {
            const endTimer = setTimeout(() => {
                errorSetter(null);
            }, 4000);
            return () => {clearTimeout(fadeoutTimer); clearTimeout(endTimer);}
        }
    }, [error]);

    return (
        <div className={styles.container} ref={contRef}>
            {type=='error' && <TriangleAlert size={32} color="red" />}
            <p>{error}</p>
        </div>
    )
}