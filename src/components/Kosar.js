import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import TermekKartya from "./TermekKartya";
import { kosarTartalmanakTorlese, fizetes } from "../actions";

const Kosar = ({
  raktarKeszlet,
  kosarTartalmanakTorleseFunkcio,
  fizetesFunkcio,
}) => {
  //AZ ITT MEGJELENITETT TERMEKEK LEHIVASA ES SZURESE A REDUX STORE-BOL
  const kosarbanlevoTermekek = raktarKeszlet.filter(
    (termek) => termek.mennyisegKosarban !== 0
    //a mennyisegKosarban parameter egyreszt nyilvantartja, hogy hany termeket kivan megvasarolni a felhasznalo,
    //masreszt a 0-nal nagyobb ertek jelzi, hogy az adott termek a kosarban van
    //a Webshopban a termekre klikkeles modositja a 0 erteket > 1-re, a Kosarban levo termekkartyan pedig a +/- gombokkal lehet tovabb nov/csokkenteni
  );

  //A MEGJELENITENI KIVANT TERMEKEK RENDERELESE
  const renderKosarbanlevoTermekek = kosarbanlevoTermekek.map((termek) => {
    return (
      <TermekKartya key={termek.azonosito} {...termek} szuloKomponens={"kosar"}>
        {termek.megnevezes}
      </TermekKartya>
    );
  });

  //USESTATE , USEEFFECT
  const [kosarDarabszama, setKosarDarabszama] = useState(0); // 'kosár tartalma: x db' kalkulaciohoz
  const [reszosszeg, setReszosszeg] = useState(0); //részösszeg kalkulaciohoz: megvasarolt termekek ara szallitasi dij nelkul
  const [szallitasiDij, setSzallitasiDij] = useState(10); //5 termek v 100 EUR felett 0 EUR, egyebkent 10 EUR
  const [fizetendoOsszeg, setFizetendoOsszeg] = useState(0); //termekek ara + szallitasi dij (ha van)
  useEffect(() => {
    //minden alkalommal, ha a komponens renderelodik, szamolja ujra
    let darabszam = kosarbanlevoTermekek.reduce((szumma, elem) => {
      return szumma + elem.mennyisegKosarban;
    }, 0);
    setKosarDarabszama(darabszam); //add ossze a darabszamot, majd mentsd el state-kent
    let kosarErteke = kosarbanlevoTermekek.reduce((szumma, elem) => {
      return szumma + elem.mennyisegKosarban * elem.ar;
    }, 0);
    setReszosszeg(kosarErteke); //add ossze az (ar*darabszam)-okat, majd mentsd el state-kent
    const szallitasidijKalkulacio =
      reszosszeg > 100 || kosarDarabszama > 5 ? 0 : 10;
    setSzallitasiDij(szallitasidijKalkulacio);
    const fizetendoOsszegKalkulacio =
      kosarDarabszama > 0 ? reszosszeg + szallitasiDij : 0;
    setFizetendoOsszeg(fizetendoOsszegKalkulacio);
  });
  //arfolyam lekerdezes axios-szal
  const [EURHUFarfolyam, setEURHUFarfolyam] = useState(null);
  const [fizetendoOsszegForintban, setFizetendoOsszegForintban]=useState(null);
  useEffect(() => {
    axios
      .get("http://data.fixer.io/api/latest?", {
        params: {
          access_key: "1faa24fe37386ac7eb06e26b7f76a9f9",
        },
      })
      .then((response) => {
        console.log(response.data.rates["HUF"]);
        setEURHUFarfolyam(response.data.rates["HUF"]);
      })
      .catch(() => {
        setEURHUFarfolyam(null);
      });
  }, []);
  //fizetendo osszeg forintban
  useEffect(()=>{
    setFizetendoOsszegForintban(Math.ceil(fizetendoOsszeg*EURHUFarfolyam/10)*10)
  },[fizetendoOsszeg, EURHUFarfolyam])

  //SCROLLOZASRA BIZTATO UZENET
  const scrollTerulet = useRef(); //ahol a termekkartyak megjelennek; azt vizsgalom a kesobbiekben, hogy ennek minden resze lathato-e
  const [scrollLathato, setScrollLathato] = useState(false);
  useEffect(() => {
    if (
      scrollTerulet.current.scrollHeight > scrollTerulet.current.clientHeight
    ) {
      setScrollLathato(true);
    } else {
      setScrollLathato(false);
    }
  }, [kosarbanlevoTermekek.length]);

  //SZOVEG SZINE MEGVALTOZIK, HA AZ EGER A KOMPONENS FOLOTT VAN
  const [egerFeletteVan, setEgerFeletteVan] = useState(false);

  //KOMPONENS RENDERELESE
  return (
    <div
      className="Kosar"
      onMouseEnter={() => {
        setEgerFeletteVan(true);
      }}
      onMouseLeave={() => {
        setEgerFeletteVan(false);
      }}
    >
      <div className="fejlec">
        <h2 style={egerFeletteVan ? { color: "wheat" } : {}}>Kosár</h2>
      </div>
      <div className="kosarTartalom">
        <div className="kosarTartalomFelsoSor">
          <h4>kosár tartalma: {kosarDarabszama} db</h4>
          <button
            className="btn btnKosarTorles"
            onClick={() => {
              kosarTartalmanakTorleseFunkcio();
            }}
          >
            kosár törlése
          </button>
          {/* scrollozasara biztato uzenet */}
          {scrollLathato && egerFeletteVan ? (
            <p className="scrollMessage">scroll</p>
          ) : null}
        </div>
        <div className="kosarbanlevoTermekek" ref={scrollTerulet}>
          <h4>kiválasztott termékek:</h4>
          {renderKosarbanlevoTermekek}
        </div>
        <div className="kosarOsszesito">
          <p>részösszeg: € {reszosszeg.toLocaleString()}</p>
          <p>szállítási díj: € {szallitasiDij}</p>
          <h4>fizetendő: € {fizetendoOsszeg}</h4>
          {fizetendoOsszegForintban? <p className='forintOsszeg'>(Ft: {fizetendoOsszegForintban.toLocaleString()}, árf: {EURHUFarfolyam.toFixed(2)})</p>:null}
          <button
            className="btn btnFizetek"
            style={fizetendoOsszeg? {visibility: 'visible'}: {visibility: 'hidden'}}
            onClick={() => {
              fizetesFunkcio();
            }}
          >
            FIZETEK!
          </button>
          <p>
            (a szállítás 5 termék vagy € 100 feletti vásárlás felett ingyenes,
            egyébként 10 €)
          </p>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    kosarTartalmanakTorleseFunkcio: () => {
      dispatch(kosarTartalmanakTorlese());
    },
    fizetesFunkcio: () => {
      dispatch(fizetes());
    },
  };
};
const mapStateToProps = (state) => {
  return { raktarKeszlet: state.raktarKeszlet };
};
export default connect(mapStateToProps, mapDispatchToProps)(Kosar);
