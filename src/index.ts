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

  console.log(customclass)

  if (!url) {
    return c.text('Missing parameter', 400)
  }



  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();



    await page.setViewport({ width, height, deviceScaleFactor: scale });

    await page.goto(url, { waitUntil: 'networkidle2' });

    if (customclass) {
      await page.evaluate((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          el.style.display = 'none';
        });
      }, customclass);
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



