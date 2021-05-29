const app = require('express')();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


const http = require('http').Server(app);
const cors = require('cors');
const bodyParser = require('body-parser')
const io = require('socket.io')(http);

const fs = require('fs');
const htmltopdf = require('html-pdf');


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

app.post('/receipt', (req, resp) => {
  const data = req.body;
  const html = fs.readFileSync(__dirname + '/html/receipt.html', 'utf-8');
  htmltopdf.create(html, {
    format: 'A4',
    "quality": "100",   
    "phantomPath": "./node_modules/phantomjs/bin/phantomjs",
  }).toFile('./pdf/test.pdf', (err, _resp) => {
    if (err) return console.log(err);
    console.log(_resp);
    resp.sendStatus(200);
  })

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