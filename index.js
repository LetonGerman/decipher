const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const sizeOf = require('image-size');
var Busboy = require('busboy');


app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','x-test');
    res.setHeader('Content-Type', 'application/json');
    next();
  });

app.use(bodyParser.urlencoded({extended : false}));

app.use(
    cors({
        credentials: true,
        origin: true
    })
);
app.use(express.json())
app.use(bodyParser.text());
app.options('*', cors());

app.post('/', (req, res) => {
    let image = [];
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      file.on('data', function(data) {
        if (fieldname === 'image') {
            image.push(data);
        }
      });
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
    busboy.on('finish', function() {
      const dimensions = sizeOf(Buffer.concat(image));
      console.log(dimensions);    
      res.json({width: dimensions.width, height: dimensions.height});
    });
    req.pipe(busboy);
});

app.get('/login', (req, res) => {
    res.send('German Leton');
});

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 3000', '');
});
