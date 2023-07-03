import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';

import { renderApp, api, cart } from '../utils';

describe('Catalog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('в каталоге должны отображаться все продукуты с сервера, а так же подробности про продукт', async () => {
    const products = [
      { id: 1, name: 'Product 1', price: 10 },
      { id: 2, name: 'Product 2', price: 20 },
    ];

    api.getProducts.mockImplementation(() => Promise.resolve({ data: products }));

    renderApp('/hw/store/catalog');

    const productNames = await screen.findAllByText(/Product \d/);
    const productPrices = screen.getAllByText(/\$10|\$20/);
    const detailsLinks = screen.getAllByText('Details');

    expect(productNames.length).toBe(products.length);
    expect(productPrices.length).toBe(products.length);
    expect(detailsLinks.length).toBe(products.length);
  });

  it('отображаются все детали продукта и кнопка добавить в корзину', async () => {
    const product = {
      id: 1,
      name: 'Product 1',
      description: 'Product 1 Description',
      price: 10,
      color: 'Red',
      material: 'Cotton',
    };

    api.getProductById.mockImplementation(() => Promise.resolve({ data: product }));

    renderApp('/hw/store/catalog/1');

    expect(await screen.findByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
    expect(screen.getByText(product.color)).toBeInTheDocument();
    expect(screen.getByText(product.material)).toBeInTheDocument();
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('при клике на "Add to cart" появляется надпись "Item in cart"', async () => {
    const product = {
      id: 1,
      name: 'Product 1',
      description: 'Product 1 Description',
      price: 10,
      color: 'Red',
      material: 'Cotton',
    };

    api.getProductById.mockImplementation(() => Promise.resolve({ data: product }));

    renderApp('/hw/store/catalog/1');

    expect(await screen.findByText('Product 1')).toBeInTheDocument();
    expect(screen.queryByText('Item in cart')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Add to Cart'));

    expect(await screen.findByText('Item in cart')).toBeInTheDocument();
  });

  it('при повторном добавлении товар добавлется в корзину', async () => {
    const product = {
      id: 1,
      name: 'Product 1',
      description: 'Product 1 Description',
      price: 10,
      color: 'Red',
      material: 'Cotton',
    };
    api.getProductById.mockImplementation(() => Promise.resolve({ data: product }));

    renderApp('/hw/store/catalog/1');
    expect(await screen.findByText('Product 1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Add to Cart'));

    fireEvent.click(screen.getByText('Add to Cart'));

    const cartState = cart.getState();
    const productQuantity = cartState[product.id]?.count;

    expect(productQuantity).toBe(2);
  });
  it('проверка кнопки в checkout',async () => {
    const product = {
      id: 1,
      name: 'Product 1',
      description: 'Product 1 Description',
      price: 10,
      color: 'Red',
      material: 'Cotton',
    };
    api.getProductById.mockImplementation(() => Promise.resolve({ data: product }));

    renderApp('/hw/store/catalog/1');
    expect(await screen.findByText('Product 1')).toBeInTheDocument();

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addToCartButton).toHaveClass('btn-lg');
  });
  
});
