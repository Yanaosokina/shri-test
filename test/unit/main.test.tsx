import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/react';
import { renderApp } from '../utils';

describe('Главная', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('в магазине должны быть страницы: главная, каталог, условия доставки, контакты', () => {
    renderApp();
    
    expect(screen.getByText('Example store')).toBeInTheDocument();
    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeInTheDocument();
    expect(screen.getByText('Contacts')).toBeInTheDocument();
  
  });

  it ('название магазина в шапке должно быть ссылкой на главную страницу', () => {
    renderApp();

    const storeNameLink = screen.getByRole('link', { name: /Example store/i });
    expect(storeNameLink.getAttribute('href')).toBe('/hw/store/');
  })
  it('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {
    renderApp();

    const catalogLink = screen.getByRole('link', { name: /Catalog/i });
    const deliveryLink = screen.getByRole('link', { name: /Delivery/i });
    const contactsLink = screen.getByRole('link', { name: /Contacts/i });
    const cartLink = screen.getByRole('link', { name: /Cart/i });

    expect(catalogLink.getAttribute('href')).toBe('/hw/store/catalog');
    expect(deliveryLink.getAttribute('href')).toBe('/hw/store/delivery');
    expect(contactsLink.getAttribute('href')).toBe('/hw/store/contacts');
    expect(cartLink.getAttribute('href')).toBe('/hw/store/cart');
  });
  
});
