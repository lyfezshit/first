import { Hono } from 'hono'
import puppeteer from 'puppeteer'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'

const app = new Hono()
app.use('*', cors())

app.get('/', async (c) => {
  return c.text('Shawty is up and running!')
})

app.get('/screenshot', async (c) => {
  const url = c.req.query('url');
  const width = parseInt(c.req.query('width') || '800');
  const height = parseInt(c.req.query('height') || '600');
  const scale = parseInt(c.req.query('scale') || '4');
  const fullPage = c.req.query('fullPage') === 'true';
  const customClass = c.req.query('customClass')

  if (!url) {
    return c.text('Missing parameter', 400)
  }

  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width, height, deviceScaleFactor: scale });

    await page.goto(url, { waitUntil: 'networkidle2' });

    if (customClass) {
      await page.evaluate((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          el.style.display = 'none';
        });
      }, customClass);
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

const port = process.env.PORT || 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
