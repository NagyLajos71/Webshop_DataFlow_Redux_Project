import {
  PLUSZGOMBRA_KATTINTAS,
  MINUSZGOMBRA_KATTINTAS,
  TORLESGOMBRA_KATTINTAS,
  TERMEKRE_KATTINTAS,
  KOSAR_TARTALMANAK_TORLESE,
  FIZETES,
  UJ_RAKTARARU_ROGZITES

} from "../actions/actionTypes";
import { raktarKeszlet } from "../data/raktarKeszlet";

export const reducer = (state, action) => {
  switch (action.type) {
    case PLUSZGOMBRA_KATTINTAS:
      
      const megnoveltKeszlet = state.raktarKeszlet.map((termek) => {
        const kosarbanlevoTermekDarabszama=termek.mennyisegKeszleten>termek.mennyisegKosarban? termek.mennyisegKosarban +1: termek.mennyisegKeszleten
        if (termek.azonosito === action.payload.azonosito) {
          termek = action.payload.szuloKomponens==='raktar'? { ...termek, mennyisegKeszleten: termek.mennyisegKeszleten + 1 } : { ...termek, mennyisegKosarban: kosarbanlevoTermekDarabszama };
        }
        return termek;
      });
      return { ...state, raktarKeszlet: megnoveltKeszlet };

    case MINUSZGOMBRA_KATTINTAS:
      const csokkentettKeszlet = state.raktarKeszlet.map((termek) => {
        const darabszamRaktar=termek.mennyisegKeszleten>0? termek.mennyisegKeszleten-1:0
        const darabszamKosar=termek.mennyisegKosarban>0? termek.mennyisegKosarban-1:0
        if (
          termek.azonosito === action.payload.azonosito ) {
          termek = action.payload.szuloKomponens==='raktar'? { ...termek, mennyisegKeszleten: darabszamRaktar } : { ...termek, mennyisegKosarban: darabszamKosar };
        }
        return termek;
      });
      return { ...state, raktarKeszlet: csokkentettKeszlet };

    case TORLESGOMBRA_KATTINTAS:
      
      const raktarbolToroltTermek = state.raktarKeszlet.filter(
        (termek) => termek.azonosito !== action.payload.azonosito
      );
      const kosarbolToroltTermek=state.raktarKeszlet.map(termek=>{
        if(termek.azonosito===action.payload.azonosito){
          termek={...termek, mennyisegKosarban:0}
        }return termek;
      });
      return { ...state, raktarKeszlet: action.payload.szuloKomponens==='raktar'? raktarbolToroltTermek:  kosarbolToroltTermek};

    case TERMEKRE_KATTINTAS:
      const vevoaltalKivalasztva = state.raktarKeszlet.map((termek) => {
        if (
          termek.azonosito === action.payload.azonosito &&
          termek.mennyisegKosarban === 0 &&
          action.payload.szuloKomponens === "aruhaz"
        ) {
          termek = { ...termek, mennyisegKosarban: 1 };
        }
        return termek;
      });
      return { ...state, raktarKeszlet: vevoaltalKivalasztva };

    case KOSAR_TARTALMANAK_TORLESE:
      const egyikTermekSincsKivalasztva = state.raktarKeszlet.map((termek) => {
        if (termek.mennyisegKosarban !== 0) {
          termek.mennyisegKosarban = 0;
        }
        return termek;
      });
      return { ...state, raktarKeszlet: egyikTermekSincsKivalasztva };

    case FIZETES:
      const fizetesUtaniRaktarkeszlet = state.raktarKeszlet.map((termek) => {
        if (termek.mennyisegKosarban > 0) {
          termek = {
            ...termek,
            mennyisegKeszleten: termek.mennyisegKeszleten - termek.mennyisegKosarban,
            mennyisegKosarban: 0,
          };
        }
        return termek;
      });
      return { ...state, raktarKeszlet: fizetesUtaniRaktarkeszlet };

    case UJ_RAKTARARU_ROGZITES:
    return {...state,  raktarKeszlet:[...state.raktarKeszlet, {azonosito:action.payload.azonosito, megnevezes:action.payload.megnevezes, ar:action.payload.ar, mennyisegKeszleten:0, mennyisegKosarban:0}]} 

    default:
      return state;
  }
};



  