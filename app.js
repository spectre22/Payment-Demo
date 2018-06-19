var express=require('express');
var path=require('path');
const keys=require('./config/keys');
var stripe=require('stripe')(keys.stripeSecretKey);
var bodyParser=require('body-parser');
var exphbs=require('express-handlebars');
const app=express();
app.engine('handlebars',exphbs({defaultLayout:'main'}));//default:layout.handlebars
app.set('view engine','handlebars');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/public',express.static(path.join(__dirname,'public')));
app.get('/',(req,res)=>{
    res.render('index',{
        stripePublishableKey:keys.stripePublishableKey
    });
});
app.post('/charge',(req,res)=>{
   
    const amount=2500;
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken
    })
    .then(customer=>stripe.charges.create({
        amount,
        description:'Ebook for java ',
        currency:'usd',
        customer:customer.id
    }))
    .then(charge=>res.render('success'));
});
const port=process.env.PORT||5000;
app.listen(port,(req,res)=>{
console.log(`Server started on port ${port}`);
})