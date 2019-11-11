
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const GridLocalStorage = require('multer-gridfs-storage');
const multer = require('multer');
const override = require('method-override');
const credentials = require('./credentials');
const express = require('express');
const app = express();







const conn = mongoose.createConnection(credentials.mongo.development.connectionString);

let gfs;
conn.once('open',()=>{
    gfs = Grid(conn.db,mongoose.mongo);
    gfs.collection('uploads');
});

const storage = new GridLocalStorage({
    url:credentials.mongo.development.connectionString,
    file:(req,file)=>{
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16,(err,buff)=>{
                if(err) return reject(err);
                const filename  = buff.toString('hex')+path.extname(file.originalname);
                const fileinfo = {
                    filename: filename,
                    bucketName:'uploads'
                };
                resolve(fileinfo);
            })
        });
    }
});

const upload = multer({storage});












const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const handlebars = require('express-handlebars').create({defaultLayout:'main'},);
const path = require('path');
const validator = require('express-validator');


const option = {
    server: {
        socketOptions: {
            keepalive: 1
        }
    }
};



mongoose.connect(credentials.mongo.development.connectionString,option);
const routes= require('./routes/routes');





















const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');
require('./config/passport');

const csrf = require('csurf');
const protection = csrf();


app.set('port',process.env.PORT || 3000);
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.set('view cache',true);
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'/public')));
app.use(require('body-parser').urlencoded({extended:true}));
app.use(require('body-parser').json());
app.use(override('_method'));
app.use(validator());
app.use(session({
    secret:credentials.mongo.development.connectionString,
    resave:false,
    saveUninitialized:false,
    store: new MongoStore({mongooseConnection:mongoose.connection}),
    cookie:{maxAge:180*60*1000}
}));
app.use(protection);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.use((req,res,next)=>{
    res.locals.session = req.session;
    next();
});





const admin = express.Router();
app.use(require('vhost')('admin.*',admin));

admin.get('/',(req,res)=>{
   res.render('layouts/admin/home');
});





app.get('/',(req,res)=>routes.homeHandler(req,res));
app.get('/add-to-favorite/:id',(req,res)=>routes.addToFavorite(req,res));
app.get('/createPost',(req,res)=>routes.createPostGET(req,res));
app.post('/createPost',upload.single('file'),(req, res) => routes.createPostPOST(req,res));


app.get('/posts/:id',(req,res)=>routes.postPage(req,res));
app.get('/api/postStorage',(req,res)=>routes.getPostStorage(req,res));
app.get('/user/signup',(req,res)=>routes.signUp(req,res));
app.get('/user/signin',(req,res)=>routes.singIn(req,res));
app.get('/user/profile',(req,res)=>routes.getProfile(req,res));
app.get('/user/logout',(req,res)=>routes.logout(req,res));
app.post('/user/signup', passport.authenticate('local.signup',{
    successRedirect:'/user/profile',
    failureRedirect:'/user/signup',
    failureFlash:true
}));
app.post('/user/signin',passport.authenticate('local.signin',{
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

app.post('/file',upload.single('file'),(req,res)=>{
    res.redirect('/');
});

app.get('/file',(req,res)=>routes.test(req,res));




app.get('/image/:img',(req,res)=>{
    let id = req.params.img;
    gfs.files.findOne({filename:id},(err,file)=>{
        if(err) res.status(404).json({err:'not such file'});
        if(file.contentType === "image/jpeg" || file.contentType === "image/png"){
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }
    })
});



app.use((req,res)=>{
    res.status(404);
    res.render('layouts/404');
});

app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.status(500);
    res.render('layouts/500');
});





function createServer() {
    app.listen(app.get('port'), () => {
        console.log('Server was successfully started');
    });
}
if(require.main == module){
    createServer();
}else{
    module.exports = createServer;
}

