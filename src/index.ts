import { Hono } from 'hono'
import puppeteer from 'puppeteer'
import puppeter from'puppeteer'

const app = new Hono()

app.get('/', async (c) => {
  return c.text('Hello!')
})

app.get('/screenshot', async (c) => {
  const url = c.req.query('url');
  const width = parseInt(c.req.query('width') || '800');
  const height = parseInt(c.req.query('height') || '600');
  const scale = parseInt(c.req.query('scale') || '4');


  if (!url) {
    return c.text('Missing parameter',400)
  }

  const browser = await puppeter.launch();
  const page = await browser.newPage();
  await page.setViewport({ width, height,deviceScaleFactor:scale });
  await page.goto(url, { waitUntil: 'networkidle2' });
  const screenshot = await page.screenshot({ type: 'png' });
  await browser.close();

  return new Response(screenshot, {
    headers: {
      'Content-Type':'image/png'
    }
  })
})

app.get('/search', async (c) => {
  const query = c.req.query('q');
  if (!query){
    return c.text('Missing parameter');
}
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const searchUrl = `https://4khdhub.fans/search?q=${encodeURIComponent(query)}`;
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });
  const html = await page.content();
  await browser.close();

  return c.html(html);

})


export default app; 



