import React, {useEffect, useState, useRef} from "react";
import { connect } from "react-redux";
import TermekKartya from "./TermekKartya"; //1 fajta termek adatai 'nevjegy' formaban
import LeltarOsszesites from "./LeltarOsszesites";
import { ujRaktarAruRogzites } from "../actions";

let inputMegnevezes; //uj termek rogzitese a raktar nyilvantartasba: inputmezo 1
let inputOsszeg; //uj termek rogzitese a raktar nyilvantartasba: inputmezo 2

const Raktar = ({ raktarKeszlet, ujRaktarAruRogzitesFunkcio }) => {

  //RAKTARBAN MEGJELENITETT TERMEKEK RENDERELESE
  const renderedraktarKeszlet = raktarKeszlet.map((termek) => {
    return (
      <TermekKartya
        key={termek.azonosito}
        {...termek}
        szuloKomponens={"raktar"} //ez segit eldontenie a TermekKartyanak, hogy a gombok a kosarba tett mennyiseget vagy a keszlet mennyiseget valtoztassak meg
      ></TermekKartya>
    );
  });

  const ujTermekInput = (e) => {
    e.preventDefault();
    if (!inputMegnevezes.value.trim() || !inputOsszeg.value.trim()) {
      //csak akkor kreal uj bevitelt, ha egyik mezo sem ures
      return;
    }
    ujRaktarAruRogzitesFunkcio(); //action: a raktarKeszlet (=raktarkeszlet)
    inputMegnevezes.value = ""; //inputmezo tartalmanak torlese
    inputOsszeg.value = ""; //inputmezo tartalmanak torlese
  };

  //Scroll-ra biztato uzenet lathatosaga
  const scrollTerulet=useRef();//ahol a termekkartyak megjelennek
  const [scrollLathato, setScrollLathato]=useState(false);
useEffect(()=>{
  if( scrollTerulet.current.scrollHeight>scrollTerulet.current.clientHeight){
    setScrollLathato(true);
  }else{
    setScrollLathato(false);
  }
},[raktarKeszlet.length]);

const [egerFeletteVan, setEgerFeletteVan]=useState(false);//cimke szine megvaltozik
  return (
    <div className="Raktar" onMouseEnter={()=>{setEgerFeletteVan(true)}} onMouseLeave={()=>{setEgerFeletteVan(false)}}>
      <div className="cimke">
        <h2 style={egerFeletteVan? {color:'wheat'}: {}}>Raktár</h2>
      </div>
      <div className="fejlec">
        {/* input: új termék rögzítéséhez */}
        <form onSubmit={ujTermekInput}>
          <label>új termék rögzítése:</label>
          <input
            type="text"
            placeholder="termék megnevezése"
            ref={(elem) => (inputMegnevezes = elem)}
          ></input>
          <label>ár:</label>
          <input
            type="number"
            placeholder="10"
            min='0'
            step={'10'}
            ref={(elem) => (inputOsszeg = elem)}
          ></input>
          <button type="submit" className='btn'>hozzáad</button>
        </form>
        {/* visszajelzes az aktualis keszletrol */}
        <LeltarOsszesites />
      </div>
      {/* itt jelenik meg az osszes TermekKartya */}
      <div className="tartalom" ref={scrollTerulet}>{renderedraktarKeszlet}</div>
      {(scrollLathato && egerFeletteVan) ? <p className="scrollMessage" >scroll</p> : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { raktarKeszlet: state.raktarKeszlet };
};
const mapDispatchToProps = (dispatch) => {
  return {
    ujRaktarAruRogzitesFunkcio: () => {
      dispatch(ujRaktarAruRogzites(inputMegnevezes.value, inputOsszeg.value));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Raktar);
