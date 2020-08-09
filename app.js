const path = require('path');


const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
dotenv.config();


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');


app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findById("5f2fe4a1b2b8d8b1277d1c70")
    .then(user =>{
        req.user = new User(user.name,user.email,user.cart,user._id);
        next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

const PORT = 3000;

mongoConnect(() => {
    app.listen(PORT,()=>{
        console.log(`Server is listening on port : ${PORT}`);
    });
});
