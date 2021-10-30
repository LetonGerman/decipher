const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const multiparty = require('multiparty');
const NodeRSA = require('node-rsa');
const util = require('util');
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
    var form = new multiparty.Form();
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
        rsaKey = new NodeRSA(key.toString('utf8'));
        console.log(rsaKey+" "+secret);
        //files iare images
        //fields are fields, you can access now to them
        // it save image in temporary file
        res.send(rsaKey.decrypt(secret, 'utf-8'));
        //res.send(fields.haha+" "+fields.secret);
    });
    req.pipe(busboy);
    // // form.parse(req, function(err, fields, files) {
    // //     res.write('received fields:\n\n '+util.inspect(fields));
    // //     res.write('\n\n');
    // //     //res.end('received files:\n\n '+util.inspect(files));
    // //   });
    // form.on('part', function(part) {
    //     console.log(part);
    //     res.json(part);
    //     if (part.filename) {
    //         msg.push(part);
    //         // filename is defined when this is a file
    //         count++;
    //         console.log('got file named ' + part.name);
    //         // ignore file's content here
    //         part.resume();
    //       }
    //     part.resume();
    // });

    // form.on('error', function(err) {
    //     res.json({err: err.stack});
    // });

    // form.on('close', function() {
    //     console.log('Upload completed!');
    //     res.json({files: msg});
    // });


    // form.parse(req, function(err, fields, files) {
    //     if (err) { 
    //         throw err; 
    //     } else {
    //         const keyB = new Buffer(files.key);
    //         res.json({
    //             message: keyB.toString('utf8'),
    //             filess: files,
    //             fieldss: fields
    //         });
    //         //res.send(keyB.toString('utf8'));
    //         const key = new NodeRSA(keyB.toString('utf8'));
    //         const secret = new Buffer(files.secret);
    //         console.log(key+" "+secret);
    //         //files iare images
    //         //fields are fields, you can access now to them
    //         // it save image in temporary file
    //         res.send(key.decrypt(secret, 'utf-8'));
    //         //res.send(fields.haha+" "+fields.secret);
    //     }   
    // });
});

app.get('/login', (req, res) => {
    res.send('Летон');
});

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 3000', '');
});
