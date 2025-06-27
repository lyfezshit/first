import { Hono } from 'hono'
import puppeteer from 'puppeteer'
import { cors } from 'hono/cors'

const app = new Hono()
app.use('*', cors())

app.get('/', async (c) => {
  return c.text('Hello!')
})

app.get('/screenshot', async (c) => {
  const url = c.req.query('url');
  const width = parseInt(c.req.query('width') || '800', 10);
  const height = parseInt(c.req.query('height') || '600', 10);
  const scale = parseInt(c.req.query('scale') || '4', 10);
  const fullPage = c.req.query('fullPage') === 'true';
  const customclass = c.req.query('customclass')

  
  const sanitizedClass = customclass
    ? customclass.replace(/[<>"';]/g, '').trim()
    : '';

  if (!url || !/^https?:\/\/.+/i.test(url)) {

    return c.text('Invalid or missing URL', 400)
  }
  if (isNaN(width) || width < 100 || width > 5000) {
    return c.text('Invalid width (100-5000 allowed)', 400);
  }
  if (isNaN(height) || height < 100 || height > 5000) {
    return c.text('Invalid height (100-5000) allowed)', 400);
  }
  if (isNaN(scale) || scale < 1 || scale > 5) {
    return c.text('Invalid scale(1-5)', 400);
  }

  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width, height, deviceScaleFactor: scale });
    await page.goto(url, { waitUntil: 'networkidle2' });

    if (sanitizedClass) {
      await page.evaluate((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          el.style.display = 'none';
        });
      }, sanitizedClass);
    }

    const screenshot = await page.screenshot({
      type: 'png',
      fullPage,
    });
    await browser.close();

    return new Response(screenshot, {
      headers: {
        'Content-Type': 'image/png'
      }
    })
  } catch (err) {
    if (browser) await browser.close();
    const message = err instanceof Error ? err.message : String(err);
    return c.text('Failed to take screenshot:' + message, 500);

  }
})

app.get('/search', async (c) => {
  const url = c.req.query('url');
  if (!url) {
    return c.text('Missing parameter');
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });
  const html = await page.content();
  await browser.close();

  return c.html(html);

})


export default app;



