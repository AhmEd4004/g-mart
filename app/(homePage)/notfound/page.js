export default function page () {

    return (
        <div style={{flex:'1', paddingTop:'40px', position:'relative'}}>
            <p style={{fontSize:'80px', fontWeight:'700', wordSpacing:'24px', color:'var(--primaryClr_400)', position:'relative', zIndex:'1'}}>Page not found</p>
            <img src={'questionmark.svg'} loading="lazy" style={{position:'absolute', width: '80%',top:'40px', right:'0', opacity:'0.3', zIndex:'0'}}/>
        </div>
    )
}