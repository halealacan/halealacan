import { useState } from "react";

const Object=()=>{
    const [kullanici,setKullanici]=useState({
        adi:"hale",
        soyad:"alacan",
        eposta:"alacanhale34@gmail.com",
        yas:21
    });
    const adGuncelle=(yeniAd)=>{
        setKullanici(prev=>({
            ...prev,
            ad:yeniAd
        }))
    }
    const soyadGuncelle=(yeniSoyad)=>{
        setKullanici(prev=>({
            ...prev,
            soyad:yeniSoyad
        }))
    }
    const epostaGuncelle=(yeniEposta)=>{
        setKullanici(prev=>({
            ...prev,
            eposta:yeniEposta
        }))
    }
    const yasGuncelle=(yeniYas)=>{
        setKullanici(prev=>({
            ...prev,
            yas:Number(yeniYas) || 0
        }))
    }

    return(
        <div className="p-4">
            <h3 className="demo-title"> demo3: nesne (objecvt) state yöbnetimi</h3>
            <div className="demo-card-layout-grid max-w-3xl">
                <div className="demo-card demo-card-3xl space-y-4">
                    <h4 className="card-title-bordered">profil düzenle</h4>
                    <div>
                        <label className="demo-label">ad:</label>
                        <input type="text" value={kullanici.ad} onChange={(e)=>adGuncelle(e.target.value)} className="demo-input" />
                    </div>
                    <div>
                        <label className="demo-label">soyad:</label>
                        <input type="text" value={kullanici.soyad} onChange={(e)=>soyadGuncelle(e.target.value)} className="demo-input" />
                    </div>
                    <div>
                        <label className="demo-label">eposta:</label>
                        <input type="text" value={kullanici.eposta} onChange={(e)=>epostaGuncelle(e.target.value)} className="demo-input" />
                    </div>
                    <div>
                        <label className="demo-label">yas:</label>
                        <input type="number" value={kullanici.yas} onChange={(e)=>yasGuncelle(e.target.value)} className="demo-input" />
                    </div>
                </div>
                <div className="dmeo-card demo-card-3xl demo-profile-card">
                    <div>
                        <span className="badge-success mb-3"> canlı profil kartı</span>
                        <h4 className="dmeo-title">{kullanici.ad} {kullanici.soyad}</h4>
                        <div className="demo-state-info space-y-2">
                            <div>
                                <strong>e posta:</strong>
                            {kullanici.eposta}
                            </div>
                             <div>
                                <strong>yas:</strong>
                            {kullanici.yas}
                            </div>
                        </div>
                        <div className="dmeo-code-footer">
                            <strong>mevcut state nesnesi (JSON)</strong>
                            <pre className="demo-pre">{JSON.stringify(kullanici,null,2)}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Object;
