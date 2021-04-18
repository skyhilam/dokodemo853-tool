const app = require('express')();
const http = require('http').Server(app);
const cors = require('cors');
const bodyParser = require('body-parser')
const io = require('socket.io')(http);

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
  resp.sendFile(__dirname + '/index.html');
});

app.post('/', (req, resp) => {
  formdata = req.body;
  io.emit('update', formdata)
  resp.sendStatus(200);
})

io.on('connection', (socket) => {
  console.log('someone join');
  console.log(formdata);
  socket.emit('update', formdata)
})

http.listen(3333, () => {
  console.log('started server');
});