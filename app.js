let express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    
    passport    = require('passport'),
    localStrategy= require('passport-local'), 
    methodOverride = require('method-override'),
    Campground  = require('./models/campground'),
    seedDB      = require('./seed'),
    Comment     = require('./models/comment'),
    Booking     = require('./models/booking'),

    User        = require('./models/user'),
    flash       = require('connect-flash')


let middleware = require('./middleware');
let commentRoutes = require('./routes/comments');
let campgroundRoutes = require('./routes/campgrounds');
let indexRoutes = require('./routes/index');

//mongoose.connect('mongodb://localhost:27017/yelp_camp_v8', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://sender:<password>@nest.xopwc.mongodb.net/Campperr', {useNewUrlParser: true , useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/Public'));
app.use(methodOverride('_method'));
// seedDB();

app.use(require('express-session')({
    secret: 'I dnt know what is this',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error= req.flash('error');
    res.locals.success= req.flash('success');
    next();
})
app.use(indexRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/campgrounds',campgroundRoutes)

app.post('/campgrounds/:id/book',middleware.isLoggedIn, function(req, res){
   var book = req.body.book;
   Booking.create(book, function(err, booking){
    if(err){
        console.log(err)
    }else{
         res.render('./campgrounds/book', {name: book.name, guests: book.guests})
    }
   })
});

app.listen(process.env.PORT);



