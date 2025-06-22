import { Hono } from 'hono'
import puppeter from'puppeteer'

const app = new Hono()

app.get('/', async (c) => {
  return c.text('Hello!')
})

app.get('/screenshot', async (c) => {
  const url = c.req.query('url');
  if (!url) {
    return c.text('Missing parameter',400)
  }

  const browser = await puppeter.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const screenshot = await page.screenshot({ type: 'png' });
  await browser.close();

  return new Response(screenshot, {
    headers: {
      'Content-Type':'image/png'
    }
  })
})

export default app;



