export default function CartPage({cart,setCart,setView}){
    return(
        <main className="container">
            <h1>Sepetim</h1>
            <p>Sepet sayfası açıldı.</p>

            <button onClick={()=>setView('home')}>
                Ana Sayfaya Dön
            </button>
        </main>
    )
}