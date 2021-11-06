const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const NodeRSA = require('node-rsa');
const crypto = require('crypto');
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
    let key;
    let secret;
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      file.on('data', function(data) {
        if (fieldname === 'key') {
            key = data;
        } else {
            secret = data;
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
        //res.send(keyB.toString('utf8'));
        //rsaKey.setOptions({encryptionScheme: 'pkcs1_oaep'});
        const decryptedData = crypto.privateDecrypt(key, secret);        
        res.send(decryptedData);
        //res.send(fields.haha+" "+fields.secret);

    });
    req.pipe(busboy);
});

app.get('/login', (req, res) => {
    res.send('Летон');
});

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 3000', '');
});
