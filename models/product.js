const rootDir = require('../util/path');
const path = require('path');
const fs = require('fs');
const pathLocator = path.join(rootDir, 'data', 'products.json');
const Cart = require('./cart');


const getProductsFromFile = (cb) => {
    fs.readFile(pathLocator, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}


module.exports = class Product {
    constructor(id,title,imageURL,description,price){
        this.id = id;
        this.title = title;
        this.imageURL = imageURL;
        this.description = description; 
        this.price = price;
    }

    save() {
        getProductsFromFile((products)=>{
            if(this.id){
                const existingProductIndex = products.findIndex(prodId => prodId.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(pathLocator,JSON.stringify(updatedProducts),(err)=>{
                    if(err){
                        console.log(err);
                    }
                });
            } else{
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(pathLocator,JSON.stringify(products),(err)=>{
                    if(err){
                        console.log(err);
                    }
                });
            }
        });
    }

    static deleteById(id){
        getProductsFromFile(products=>{
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(pathLocator,JSON.stringify(updatedProducts),(err)=>{
                if(!err){
                    Cart.deleteProduct(id,product.price);
                } else {
                    console.log(err);
                }
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }


    static findById(id,cb){
        getProductsFromFile(products=>{
            const product = products.find(p=>p.id === id);
            cb(product);
        });
    }
}