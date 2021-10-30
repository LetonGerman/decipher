const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const multiparty = require('multiparty');
const NodeRSA = require('node-rsa');


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
    form.parse(req, function(err, fields, files) {
        if (err) { 
            throw err; 
        } else {
            const keyB = new Buffer(files.key);
            res.send(keyB.toString('utf8'));
            const key = new NodeRSA(keyB.toString('utf8'));
            const secret = new Buffer(files.secret);
            console.log(key+" "+secret);
            //files iare images
            //fields are fields, you can access now to them
            // it save image in temporary file
            res.send(key.decrypt(secret, 'utf-8'));
            //res.send(fields.haha+" "+fields.secret);
        }   
    });
});

app.get('/login', (req, res) => {
    res.send(Летон);
});

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 3000', '');
});
