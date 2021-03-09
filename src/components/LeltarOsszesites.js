import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

const LeltarOsszesites = ({ raktarKeszlet }) => {
  const [arukeszletDarabszama, setArukeszletDarabszama] = useState(0);
  const [arukeszletErteke, setArukeszletErteke] = useState(0);
  useEffect(() => {
    let aruKeszlet_db = raktarKeszlet.reduce((szumma, elem) => {
      return szumma + elem.mennyisegKeszleten;
    }, 0);
    setArukeszletDarabszama(aruKeszlet_db);
    let aruKeszlet_penzben = raktarKeszlet.reduce((szumma, elem) => {
      return szumma + elem.mennyisegKeszleten * elem.ar;
    }, 0);
    setArukeszletErteke(aruKeszlet_penzben);
  },[raktarKeszlet]);
  
  return (
    <div className="leltarOsszesites">
      <p>készlet: {arukeszletDarabszama} db</p>
      <p>készlet értéke: € {arukeszletErteke.toLocaleString()}</p>
    </div>
  );
};
const mapStateToProps = (state) => {
  return { raktarKeszlet: state.raktarKeszlet };
};
export default connect(mapStateToProps)(LeltarOsszesites);
