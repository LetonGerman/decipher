const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const multiparty = require('multiparty');


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
            console.log(fields.haha+" "+fields.secret);
            //files iare images
            //fields are fields, you can access now to them
            // it save image in temporary file
            
            res.send(fields.haha+" "+fields.secret);
        }   
    });
});

app.get('/login', (req, res) => {
    res.send(Летон);
});

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 3000', '');
});
