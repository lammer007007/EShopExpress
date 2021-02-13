const express = require('express');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const hostname = '127.0.0.1';
const port = 9999;

let products = [];
let images = {};
let formats = {};

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({limits: { fileSize: 50 * 1024 * 1024 }}));

app.use('/', express.static(__dirname + '/wwwroot'));

app.get('/products', (req, res) => {
    res.json(products);
});

app.post('/products', (req, res) => {
    if(req.body.id && req.body.title && req.body.category && +req.body.price){
        let id = req.body.id;
        if(id == -1){
            id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
            products.push({
                id: id,
                title: req.body.title,
                category: req.body.category,
                price: req.body.price,
                description: req.body.description ? req.body.description : ''
            });
            res.location('/?id=' + id).status(302).json(products[products.length - 1]);
        }
        else{
            let temp = products.find(i => i.id == id);
            if(temp == null){
                res.statusCode = 400;
                res.end();
                return;
            }
            temp.title = req.body.title;
            temp.category = req.body.category;
            temp.price = req.body.price;
            temp.description = req.body.description ? req.body.description : '';
            res.location('/?id=' + id).status(302).json(temp);
        }

        if(req.files && req.files.img){
            images[id] = req.files.img.data;
            formats[id] = req.files.img.mimetype;
        }
        else if(req.body.clear){
            delete images[id];
            delete formats[id];
        }
    }
});

app.delete('/products', (req, res) => {
    if(req.body.id){
        products.splice(products.findIndex(i => i.id == req.body.id), 1);
        res.statusCode = 200;
        res.end();
        return;
    }
    res.statusCode = 400;
    res.end(400);
});

app.get('/images', (req, res) => {
    if(req.query && req.query.id && req.query.id in images){
        res.contentType(formats[req.query.id]);
        res.end(images[req.query.id]);
        return;
    }
    res.contentType('image/png');
    res.end(fs.readFileSync('wwwroot/no-img.png'));
});

app.listen(port, hostname);
console.log(`Сервер запущен`);