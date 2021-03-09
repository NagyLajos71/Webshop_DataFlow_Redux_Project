import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import {
  pluszGombFunkcio, //attol fugg, hogy melyik a szuloKomponens, vagy a mennyisegKeszleten, vagy a mennyisegKosarban property-t modositjak
  minuszGombFunkcio,
  torlesGombFunkcio, //vagy a raktarkeszletbol, vagy a kosrarbol tavolitja el a szuloKontener props-tol fuggoen
  termekreKattintas,
} from "../actions";

const TermekKartya = ({
  megnevezes,
  ar,
  mennyisegKeszleten,
  mennyisegKosarban,
  pluszGombFunkcio,
  minuszGombFunkcio,
  torlesGombFunkcio,
  termekreKattintasFunkcio,
  szuloKomponens,
}) => {
  
  //FELTETELES FORMAZASI BEALLITASOK
  const dbszamLathatosagStilus = //az egyik sor lathatosaganak ki/be kapcsolasa (hany db van a termekbol a kosarban; Kosar komponens)
    szuloKomponens === "kosar" ? { display: "visible" } : { display: "none" };
  const elrejtettGombStilus = //nem latszik a +/-/torles gomb (Aruhaz komponen)
    szuloKomponens === "aruhaz" ? { display: "none" } : { display: "visible" };
  const nincsKeszletenStilus = //ha a termek nincs keszleten, mas lesz a szine a kartyanak (Raktar komponens)
    mennyisegKeszleten > 0
      ? { backgroundColor: " #458096", color: ":#668fa0" }
      : { backgroundColor: "transparent", color: "black", boxShadow:'none', border:'none'};
    const webshopKartyaStilus= szuloKomponens==='aruhaz'? {height:'130px', alignItems:'center', justifyContent:'center', fontSize:'120%'}:null;
    const kosarKartyaStilus=szuloKomponens==='kosar'? {flexDirection:'row', width:'200px', margin:'auto'} :null;
  const egyesitettKartyaStilus={...nincsKeszletenStilus, ...webshopKartyaStilus, ...kosarKartyaStilus};

  const [egerFeletteVan, setEgerFeletteVan]=useState(false);//cimke szine megvaltozik

  
  const [figyelmeztetoSzin, setFigyelmeztetoSzin]=useState('');
  useEffect(()=>{
    mennyisegKeszleten<mennyisegKosarban? setFigyelmeztetoSzin('salmon') :setFigyelmeztetoSzin('');
    
  },[mennyisegKeszleten])
  return (
    <div
      className="TermekKartya"
      style={egyesitettKartyaStilus}
      onClick={() => {
        termekreKattintasFunkcio();
      }}
      onMouseEnter={()=>{setEgerFeletteVan(true)}} onMouseLeave={()=>{setEgerFeletteVan(false)}}
    >
      <div className="termekAdat">
        <h3 style={egerFeletteVan? {color:'wheat'}: {}}>{megnevezes}</h3>
        <h4 >ár: € {ar}</h4>
        <h4 style={dbszamLathatosagStilus}>
          kosárban: <span style={{color:figyelmeztetoSzin}}>{mennyisegKosarban} db</span>
        </h4>
        <h4>készleten: <br></br>{mennyisegKeszleten} db</h4>
      </div>
      <div className="termekGombok" style={szuloKomponens==='kosar'? {backgroundColor: 'rgba(29, 104, 29, 0.251)'}: null}>
        <div>
          <button
            className="btn btnPlusMinus"
            style={elrejtettGombStilus}
            onClick={() => {
              pluszGombFunkcio();
            }}
          >
            +
          </button>
          <button
            className="btn btnPlusMinus"
            style={elrejtettGombStilus}
            onClick={() => {
              minuszGombFunkcio();
            }}
          >
            -
          </button>
        </div>
        <button
          className="btn btnTorles"
          style={elrejtettGombStilus}
          onClick={() => {
            torlesGombFunkcio();
          }}
        >
          töröl
        </button>
      </div>
    </div>
  );
};
const mapDispatchToProps = (dispatch, ownProps) => {
  const { azonosito, szuloKomponens } = ownProps;

  return {
    pluszGombFunkcio: () => {
      dispatch(pluszGombFunkcio(azonosito, szuloKomponens));
    },
    minuszGombFunkcio: () => {
      dispatch(minuszGombFunkcio(azonosito, szuloKomponens));
    },
    torlesGombFunkcio: () => {
      dispatch(torlesGombFunkcio(azonosito, szuloKomponens));
    },
    termekreKattintasFunkcio: () => {
      dispatch(termekreKattintas(azonosito, szuloKomponens));
    },
  };
};
export default connect(null, mapDispatchToProps)(TermekKartya);
