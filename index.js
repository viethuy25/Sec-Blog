const app = require('express')()
const path = require('path')

const hbs = require('hbs');

//this required before view engine setup
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');

app.set('views',path.join(__dirname,"views"))
app.set("view engine","hbs")

app.get('/',(req,res)=>{
    res.render('index');
})

app.listen(5000);