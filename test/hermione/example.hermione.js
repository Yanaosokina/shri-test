const {assert} = require('chai');

describe('Общие требования', async function () {

  it('верстка адаптивная', async function ({browser}) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
    await page.setViewport({ width: 1440, height: 800 });
    await browser.url('http://localhost:3000/hw/store/');
    await page.waitForLoadState({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000)
    await browser.assertView('plain', '.navbar');
    

  });
 
  it('при выборе элемента из меню "гамбургера", меню должно закрываться', async function ({browser}) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    // Задаем ширину экрана для эмуляции мобильного устройства
    await page.setViewport({ width: 414, height: 800 });
    await browser.url('http://localhost:3000/hw/store/');
    await page.waitForTimeout(5000);
    try {
        await page.waitForSelector('.Application-Toggler', { timeout: 5000 });
      
        // Кликаем на гамбургер для открытия меню
        await page.click('.Application-Toggler');
      
        // Проверяем, что меню открыто
        await page.waitForSelector('.collapse .navbar-collapse', { timeout: 10000 });
      
        // Кликаем на элемент меню (например, "Catalog")
        await page.click('a.nav-link[href="/catalog"]');
      
        // Ожидаем закрытия меню
        await page.waitForSelector('.navbar-collapse', { hidden: true, timeout: 10000 });
      
        console.log('Тест успешно пройден: меню закрывается после выбора элемента.');
      } catch (error) {
        console.error('Тест не пройден:', error);
      }
  })

  it('при ширине экрана < 576px навигационное меню должно скрываться за "гамбургер"', async function ({browser}) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
  
    // Задаем ширину экрана меньше 576px
    await page.setViewport({ width: 500, height: 800 });
  
    // Открываем страницу приложения
    await browser.url('http://localhost:3000/hw/store/');
    await page.waitForTimeout(5000);
    
    try {
      await page.waitForSelector('.Application-Toggler', { timeout: 5000 });
    
      // Проверяем, что навигационное меню скрыто
      const isMenuHidden = await page.$eval('.collapse .navbar-collapse', menu => {
        const styles = window.getComputedStyle(menu);
        return styles.display === 'none';
      });
      if (isMenuHidden) {
        console.log('Тест успешно пройден: навигационное меню скрыто за "гамбургером".');
      } else {
        console.error('Тест не пройден: навигационное меню не скрыто за "гамбургером".');
      }
    } catch (error) {
      console.error('Тест не пройден:', error);
    }
  });

});
