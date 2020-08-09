const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    var ConnectionString = 'mongodb+srv://' + process.env.MongoDB_USER + ':' +
        process.env.MongoDB_PW + '@node-rest-shop-n6p9q.mongodb.net/e-commerce?retryWrites=true&w=majority';

    MongoClient.connect(ConnectionString,{useUnifiedTopology: true})
        .then(client => {
            console.log('MongoDB Connected!');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};


const getDb = ()=>{
    if(_db){
        return _db;
    }
    throw 'No Database Found!';
}


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;