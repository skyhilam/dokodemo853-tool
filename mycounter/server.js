const express = require('express');

const app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'))


const http = require('http').Server(app);
const cors = require('cors');
const bodyParser = require('body-parser')
const io = require('socket.io')(http);
const printer = require('pdf-to-printer');

const fs = require('fs');
const puppeteer = require('puppeteer')


var formdata = {
  items: [],
  customer: {},
  payment: {}
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());


app.get('/', (req, resp) => {
  resp.sendFile(__dirname + '/html/index.html');
});

app.post('/receipt', async (req, resp) => {
  const data = req.body;
  const json_data = JSON.stringify(data);

  const browser = await puppeteer.launch({
    headless: true,
  })


  const page = await browser.newPage()

  await page.setViewport({ width: 296, height: 296 })

  const html = fs.readFileSync(__dirname + '/html/receipt.html', 'utf-8').replace('#jsondata', json_data);

  // await page.goto(
  //   `data:text/html,${html}`,
  // );
  await page.setContent(html, {
    waitUntil: 'networkidle0'
  })


  // await page.goto('data:text/html,' + await page.content());

  const height = await page.evaluate(() => {
    return document.documentElement.offsetHeight
  })


  const heightmm = Math.ceil((height + 30) * 0.2646);

  // or a .pdf file
  await page.pdf({
    pageRanges: '1',
    width: '80mm',
    height: `${heightmm}mm`,
    path: `${__dirname}/pdf/receipt.pdf`
  })

  // close the browser
  await browser.close();


  printer.print(`${__dirname}/pdf/receipt.pdf`)
    .then(console.log)
    .catch(console.error);

  resp.sendStatus(200);


  // console.log(html);

})

app.post('/', (req, resp) => {
  formdata = req.body;
  io.emit('update', formdata)
  resp.sendStatus(200);
})

io.on('connection', (socket) => {
  socket.emit('update', formdata)
})

http.listen(3333, () => {
  console.log('http://localhost:3333');
});