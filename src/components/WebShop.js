import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import TermekKartya from "./TermekKartya"; //1 fajta termek adatai 'nevjegy' formaban

const WebShop = ({ raktarKeszlet }) => {
  let termekMegnevezesSzuro; //inputfield ref property
  const [termekNevereKeres, setTermekNevereKeres] = useState(""); //termeknev szuro: input-ba irt szoveg

  //INPUT ONCHANGE:
  const termeknevBeirasaaKeresobe = (e) => {
    setTermekNevereKeres(e.target.value);
  };

  //MEGVALTOZIK A SZOVEG SZINE AZ EGER MOZGASARA
  const [egerFeletteVan, setEgerFeletteVan] = useState(false); //cimke szine megvaltozik

  //ARUKRA SZURES LEPES 3/1: csak azok, amelyek raktarkeszleten vannak
  const boltiAruKeszlet = raktarKeszlet.filter(
    //csak azok latsszanak a boltban, amelyek raktaron (keszleten) vannak
    (termek) => termek.mennyisegKeszleten > 0
  );
  //ARUKRA SZURES LEPES 3/2: a termeknevre kerses szuro figyelembevetele
  const termeknevreSzurtBoltiArukeszlet = boltiAruKeszlet.filter((
    termek //csak azok latszodjanak, ahol a megnevezes tartalmazza az inputmezobe irt szoveget
  ) =>
    termek.megnevezes
      .toLowerCase()
      .includes(termekNevereKeres.toLocaleLowerCase().trim())
  );

  //TERMEK ÁR SZURO a 3/3-as lepeshez
  const [legolcsobbKaphatoTermek, setLegolcsobbKaphatoTermek] = useState(0);
  const [legdragabbKaphatoTermek, setlegdragabbKaphatoTermek] = useState(0);
  const [kisebbikArszuroErteke, setKisebbikArszuroErteke] = useState(
    legolcsobbKaphatoTermek
  );
  const [nagyobbikArszuroErteke, setNagyobbikArszuroErteke] = useState(
    legdragabbKaphatoTermek
  );

  useEffect(() => {
    if (termeknevreSzurtBoltiArukeszlet[0]) {
      //ha letezik (true)
      setLegolcsobbKaphatoTermek(
        //mi a boltban kaphato termekek kozul a legolcsobb? Ez lesz a tol-ig szuro minimum erteke
        termeknevreSzurtBoltiArukeszlet.reduce((a, b) => {
          return Math.min(a, b.ar);
        }, termeknevreSzurtBoltiArukeszlet[0].ar)
      );
      setlegdragabbKaphatoTermek(
        //mi a boltban kaphato termekek kozul a legdragabb? Ez lesz a tol-ig szuro maximum erteke
        termeknevreSzurtBoltiArukeszlet.reduce((a, b) => {
          return Math.max(a, b.ar);
        }, termeknevreSzurtBoltiArukeszlet[0].ar)
      );
    }
  }, [termeknevreSzurtBoltiArukeszlet]);
  useEffect(() => {
    //ez az osszeg jelenjen meg indulaskor a tol-ig szuroben
    setNagyobbikArszuroErteke(legdragabbKaphatoTermek);
  }, [legdragabbKaphatoTermek]);
  useEffect(() => {
    //ez az osszeg jelenjen meg indulaskor a tol-ig szuroben
    setKisebbikArszuroErteke(legolcsobbKaphatoTermek);
  }, [legolcsobbKaphatoTermek]);

  const arszuroTOLertekeMegvaltozik = (e) => {
    //ezt az osszeget allitja be a felhasznalo szurofeltetelkent
    setKisebbikArszuroErteke(e.target.value);
  };
  const arszuroIGertekeMegvaltozik = (e) => {
    //ezt az osszeget allitja be a felhasznalo szurofeltetelkent
    setNagyobbikArszuroErteke(e.target.value);
  };
  //ARUKRA SZURES LEPES3:termeknevre es árra(€) is szurt arukeszlet
  const mindenszuronAtmentBoltiArukeszlet = termeknevreSzurtBoltiArukeszlet.filter(
    (termek) =>
      termek.ar >= kisebbikArszuroErteke && termek.ar <= nagyobbikArszuroErteke
  );

  //A MEGSZURT TERMEKEK RENDERELESE
  const renderBoltiAruKeszlet = mindenszuronAtmentBoltiArukeszlet.map(
    (termek) => {
      return (
        <TermekKartya
          key={termek.azonosito}
          {...termek}
          szuloKomponens={"aruhaz"} //felteteles formazasahoz kell, illetve hogy a +- gomb amennyisegKeszleten-t vagy a mennyisegKosarban-t modositsa
        >
          {termek.megnevezes}
        </TermekKartya>
      );
    }
  );
  //SCROLLOZASRA BIZTATO FELIRAT (ha szukseges, megjelenik)
  const scrollTerulet = useRef(); //ahol a termekkartyak megjelennek
  const [scrollLathato, setScrollLathato] = useState(false);
  useEffect(() => {
    if (
      scrollTerulet.current.scrollHeight > scrollTerulet.current.clientHeight
    ) {
      setScrollLathato(true);
    } else {
      setScrollLathato(false);
    }
  }, [boltiAruKeszlet.length]);

  //KOMPONENS RENDERELESE
  return (
    <div
      className="WebShop"
      onMouseEnter={() => {
        setEgerFeletteVan(true);
      }}
      onMouseLeave={() => {
        setEgerFeletteVan(false);
      }}
    >
      <div className="cimke">
        <h2 style={egerFeletteVan ? { color: "wheat" } : {}}>Webshop</h2>
      </div>
      <div className="fejlec">
        {/* termekre szures */}
        <label>
          Árukeresés név alapján:
          <input
            type="text"
            placeholder="terméknévre szűrés..."
            onChange={termeknevBeirasaaKeresobe}
            ref={(elem) => (termekMegnevezesSzuro = elem)}
          ></input>
        </label>
        <div>
          <label>
            és/vagy vételár szűrő:
            <input
              type="number"
              min={legolcsobbKaphatoTermek}
              max={nagyobbikArszuroErteke}
              value={kisebbikArszuroErteke}
              onChange={arszuroTOLertekeMegvaltozik}
              step={10}
            />
            -tól
            <input
              type="number"
              min={kisebbikArszuroErteke}
              max={legdragabbKaphatoTermek}
              value={nagyobbikArszuroErteke}
              onChange={arszuroIGertekeMegvaltozik}
              step={10}
            />
            -ig
          </label>
        </div>

        <button
          className="btn btnFejlec"
          onClick={() => {
            termekMegnevezesSzuro.value = "";
            setTermekNevereKeres("");
            setNagyobbikArszuroErteke(legdragabbKaphatoTermek);
            setKisebbikArszuroErteke(legolcsobbKaphatoTermek);
          }}
        >
          szűrők törlése
        </button>
      </div>
      {/* itt renderelem a boltban kaphato termekeket */}
      <div className="tartalom" ref={scrollTerulet}>
        {renderBoltiAruKeszlet}
      </div>
      {scrollLathato && egerFeletteVan ? (
        <p className="scrollMessage">scroll</p>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { raktarKeszlet: state.raktarKeszlet };
};
export default connect(mapStateToProps)(WebShop);
