import { useState } from "react";

const Toggle=()=>{
    const [sifreGoster,setSifreGoster]=useState(false);
    const [geceModu,setGeceModu]=useState(false);
    const [girisSifre,setGirisSifre]=useState('password123');

    const sifreToggle=()=>{
        setSifreGoster( prev=> !prev);
    }
     const modToggle=()=>{
        setGeceModu( prev=> !prev);
    }

    return(
        <div className="P-4">
            <h3 className="demo-title">demo 2: mantıksal (boolean ) state yönetimi </h3>
            <div className={`demo-card demo-card-lg demo-toggle-card ${geceModu ? "demo-card-dark":""}`}>
                <div className="card-header">
                    <h4 className="font-bold" >örnek panel </h4>
                    <button onClick={modToggle} className="btn-toggle-mode">
                        {geceModu ? "gündüz modu": "gece modu"}
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className={geceModu ? "demo-label demo-label-dark":"demo-label"}>giriş şifresi</label>
                        <div className="relative">
                            <input type={sifreGoster ? "text":"password"} value={girisSifre} onChange={(e)=>setGirisSifre(e.target.value)} className={geceModu ? "demo-input demo-input-dark pr-20" : "demo-input pr-20"}/>
                            <button type="button" onClick={sifreToggle} className="btn-password-toggle">
                                {sifreGoster ? "gizle" : "goster" }
                            </button>
                        </div>
                    </div>
                    <div className="demo-state-info">
                        <strong>durum bilgisi</strong>
                        <ul className="demo-info-list">
                            <li>gece modu:<code>{geceModu ? "açık(true)":"kapalı(false)"}</code></li>
                            <li>sifre gosterimi<code>{sifreGoster ? "açık":"kapalı"}</code></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Toggle;
