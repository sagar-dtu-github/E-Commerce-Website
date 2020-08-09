const mongodb = require('mongodb');
const { get } = require('../routes/shop');
const getDb = require('../util/database').getDb;

class User{
    constructor(username, email,cart,_id){
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = _id;
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            //if product exists then increase the quantity by one
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            // if not then push new product to the items array
            updatedCartItems.push({
                productId: new mongodb.ObjectId(product._id),
                quantity: newQuantity
            });
        }

        const updatedCart = {
            items: updatedCartItems
        };
        const db = getDb();
        return db
            .collection('users')
            .updateOne({
                _id: new mongodb.ObjectId(this._id)
            }, {
                $set: {
                    cart: updatedCart
                }
            });
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(p => {
            return p.productId;
        });
        return db.collection('products')
            .find({
                _id: {
                    $in: productIds
                }
            })
            .toArray()
            .then(products => {
                console.log(products);
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    }
                });
            });
    }


    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db
            .collection('users')
            .updateOne({
                _id: new mongodb.ObjectId(this._id)
            }, {
                $set: {
                    cart: {
                        items: updatedCartItems
                    }
                }
            });
    }


    addOrder() {
        const db = getDb();
        return this.getCart()
        .then(products=>{
            const order = {
                items : products,
                user : {
                    _id : new mongodb.ObjectId(this._id),
                    name : this.name
                }
            };
            return db.collection('orders')
            .insertOne(order);
        })
        .then(result =>{
            this.cart = { items : [] };
            return db
            .collection('users')
            .updateOne({
                _id: new mongodb.ObjectId(this._id)
            }, {
                $set: {
                    cart: {
                        items: []
                    }
                }
            });
        });
    }


    getOrders() {
        const db = getDb();
        return db.collection('orders')
        .find({ 'user._id'  : new mongodb.ObjectId(this._id)})
        .toArray();
    }


   save(){
        const db = getDb();
        return db.collection('users')
        .insertOne(this);
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users')
        .findOne({ _id : new mongodb.ObjectId(userId)});
    }
}

module.exports = User;