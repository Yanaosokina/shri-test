import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CartApi } from '../src/client/api';

import { Application } from '../src/client/Application';
import { initStore } from '../src/client/store';

export const basename = '/hw/store/';
export const api: any = {
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  checkout: jest.fn(),
};
export const cart = new CartApi();

export function renderApp(url = basename) {
  window.history.pushState({}, '', url);


  const cart = new CartApi();
  const store = initStore(api, cart);

  render(
    <BrowserRouter basename={basename}>
      <Provider store={store}>
        <Application />
      </Provider>
    </BrowserRouter>,
  );
}
