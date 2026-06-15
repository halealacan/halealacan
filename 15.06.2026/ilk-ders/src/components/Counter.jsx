import { useState } from "react";

const Counter=()=>{
    const[sayi,setSayi]=useState(0);
    
    const arttir=()=>{
        setSayi(sayi+1);
    }
    const azalt=()=>{
        setSayi(sayi-1);
    }
    const sifirla=()=>{
        setSayi(0);
    }
    const besArttir=()=>{
        setSayi ((oncekiSayi)=> oncekiSayi+5);
}

return(
    <div className="p-4">
        <h3 className="font-bold">temel Counter</h3>
        <div className="card p-4">
            <span className="text-sm">mevcut deger</span>
            <span className="text-6xl">{sayi}</span>

            <div className="flex flex-wrap gap-2">
                <button className="felex-1" onClick={azalt}>-1 azalt</button>
                <button className="felex-1" onClick={sifirla}>sıfırla</button>
                <button className="felex-1" onClick={arttir}>+1 arttır</button>
                <button className="felex-1" onClick={besArttir}>+5 arttır (Güvenli Callback::prev)</button>
            </div>
            <div className="mt-6">
                <h4 className="font-semibold">öğrenim notu</h4>
                <ul className="list-disc">
                    <li>(0) başlangıc değerini 0 olarak kodlar</li>
                    <li>state içindeki sayi=sayi+1 seklinde degistirilemez.usestate bir fonksiyon. ister set ile başlayan bu state içindeki değeri
                        güncellmek vb. işlemleri yapmak için kullanılır.
                    </li>
                    <li>ardısık veya asenkron durumlarda önceki degere bagımlı güncellemeler için prev(callback)</li>
                </ul>
            </div>
        </div>
    </div>
)
}
export default Counter;