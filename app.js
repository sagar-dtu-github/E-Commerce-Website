const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController= require('./controllers/error');


app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));    
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);


const PORT = 3000;
app.listen(3000, ()=> console.log(`Server is running at PORT : ${PORT}`));
