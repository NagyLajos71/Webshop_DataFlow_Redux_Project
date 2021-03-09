import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from "react-redux";
import { createStore } from "redux";
import {reducer} from './reducers';
import {raktarKeszlet} from './data/raktarKeszlet';


const initialStore={raktarKeszlet}

ReactDOM.render(
  <Provider store={createStore(reducer, initialStore)}>
    <App />
  </Provider>,
  document.getElementById('root')
);

