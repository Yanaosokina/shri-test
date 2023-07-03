import '@testing-library/jest-dom/extend-expect';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderApp, cart, api } from '../utils';

describe('Корзина', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });
  const PHONE_REGEX = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

  it('в шапке отображаются только кол-во уникальных товаров', () => {
    const products = {
      1: { name: 'Item 1', count: 2, price: 10 },
      2: { name: 'Item 2', count: 1, price: 20 },
      3: { name: 'Item 3', count: 4, price: 15 },
    };
    cart.setState(products);

    renderApp('/hw/store/cart');

    const uniqueItemCount = Object.keys(products).length;
    const cartItemCount = screen.getByText(uniqueItemCount.toString());

    expect(cartItemCount).toBeInTheDocument();
  });

  it('в корзине должна отображаться таблица с добавленными в нее товарами', () => {
    const products = {
      1: { name: 'Item 1', count: 2, price: 10 },
      2: { name: 'Item 2', count: 1, price: 20 },
      3: { name: 'Item 3', count: 4, price: 15 },
    };
    cart.setState(products);
    renderApp('/hw/store/cart');

    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();

    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(Object.keys(products).length + 2);

    const tableHeadings = screen.getAllByRole('columnheader');
    expect(tableHeadings).toHaveLength(5);
  });
  it('в корзине кнопка ClearCart', () => {
    const products = {
      1: { name: 'Item 1', count: 2, price: 10 },
      2: { name: 'Item 2', count: 1, price: 20 },
      3: { name: 'Item 3', count: 4, price: 15 },
    };
    cart.setState(products);

    renderApp('/hw/store/cart');

    const clearButton = screen.getByRole('button', { name: /clear shopping cart/i });
    expect(clearButton).toBeInTheDocument();
  });
  it('если корзина пустая, должна отображаться ссылка на каталог товаров', () => {
    const products = {}; // Empty cart
    cart.setState(products);

    renderApp('/hw/store/cart');

    const catalogLinks = screen.queryAllByRole('link', { name: /catalog/i });
    expect(catalogLinks.length).toBeGreaterThan(0);
  });

  it('checkout форма работает корректно', async () => {
    const products = {
      1: { name: 'Item 1', count: 2, price: 10 },
      2: { name: 'Item 2', count: 1, price: 20 },
      3: { name: 'Item 3', count: 4, price: 15 },
    };
    cart.setState(products);
    api.checkout.mockImplementation(() => Promise.resolve({ data: { id: 3 } }));
    renderApp('/hw/store/cart');

    const phoneInput = screen.getByLabelText(/phone/i);
    const nameInput = screen.getByLabelText(/name/i);
    const addressInput = screen.getByLabelText(/address/i);
    const checkoutButton = screen.getByRole('button', { name: /checkout/i });

    fireEvent.change(phoneInput, { target: { value: '8999999999' } });
    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(addressInput, { target: { value: 'Paris' } });

    // кликаем
    fireEvent.click(checkoutButton);

    screen.debug();
    expect(await screen.findByText('Well done!'));
  });
});
