import {
  PLUSZGOMBRA_KATTINTAS,
  MINUSZGOMBRA_KATTINTAS,
  TORLESGOMBRA_KATTINTAS,
  TERMEKRE_KATTINTAS,
  KOSAR_TARTALMANAK_TORLESE,
  FIZETES,
  UJ_RAKTARARU_ROGZITES,
} from "./actionTypes";
import {raktarKeszlet} from '../data/raktarKeszlet'

let ujAzonosito = raktarKeszlet.length+1;//uj raktari termek hozzaadasa eseten innen indul a sorszam 

export const pluszGombFunkcio = (azonosito, szuloKomponens) => {
  return {
    type: PLUSZGOMBRA_KATTINTAS,
    payload: { azonosito: azonosito, szuloKomponens: szuloKomponens },
  };
};
export const minuszGombFunkcio = (azonosito, szuloKomponens) => {
  return {
    type: MINUSZGOMBRA_KATTINTAS,
    payload: { azonosito: azonosito, szuloKomponens: szuloKomponens },
  };
};
export const torlesGombFunkcio = (azonosito, szuloKomponens) => {
  return {
    type: TORLESGOMBRA_KATTINTAS,
    payload: { azonosito: azonosito, szuloKomponens: szuloKomponens },
  };
};

export const termekreKattintas = (azonosito, szuloKomponens) => {
  return {
    type: TERMEKRE_KATTINTAS,
    payload: { azonosito: azonosito, szuloKomponens: szuloKomponens },
  };
};

export const kosarTartalmanakTorlese = () => {
  return { type: KOSAR_TARTALMANAK_TORLESE };
};

export const fizetes = () => {
  return { type: FIZETES };
};

export const ujRaktarAruRogzites = (megnevezes, ar) => {
  return {
    type: UJ_RAKTARARU_ROGZITES,
    payload: { azonosito: ujAzonosito++, megnevezes: megnevezes, ar: ar },
  };
};
