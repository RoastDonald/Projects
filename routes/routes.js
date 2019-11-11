
const Posts = require('../models/Posts');
const PostStorage = require('../models/PostStorage');








module.exports = {
    homeHandler: (req, res) => {
        Posts.find().exec((err,posts)=>{



            let context ={
                posts: posts.map((post,i)=>{

                    if(typeof post.date === 'undefined') {
                        console.log('without date');
                    }
                    return {
                        subject:post.subject || '',
                        text:post.text || '',
                        id:post.id || i,
                        date:post.date || '',
                        imagePath:post.imagePath || 'https://semantic-ui.com/images/wireframe/image.png',
                        isImage:post.imagePath !== ''
                    }
                })
            };

            context.auth = req.session.auth;
            res.render('layouts/home',context);
        });
    },

    createPostGET: (req, res) => {

        res.render('layouts/createPostPage',{csrfToken:req.csrfToken()});
    },

    test:(req,res)=> {
        res.render('layouts/test');
    },







     createPostPOST: (req, res) => {
         let context = req.body;
                        Posts.find((err, posts) => {
                     if (err) {
                         console.log('error');
                         throw Error(err);
                     }
                     context.id = posts.length;

         }).then(()=>{



             let obj = {};
             function PATH() {
                 if (!req.file) {
                     obj.id = ''
                 } else {
                     obj.id = req.file.filename;
                 }
             }

                 let path = PATH();
                console.log(path);
             console.log(path);

                 Posts.create({
                     subject: context.subject,
                     text: context.message,
                     id: context.id,
                     date:Date(),
                     imagePath: obj.id
                 }, (er, post) => {
                 if (er) throw new Error(er);
                 context._id = post._id;
                 res.redirect(303, '/');
             });
         });

     },

    addToFavorite:(req,res)=>{
        let post = req.param("id");
        const postStorage = new PostStorage(req.session.storageP?req.session.storageP:{});


        Posts.find({id:post}).exec((err,postDb)=>{
           if(err){
               console.log('data is not found!' + err);
               return res.redirect('/');
           }
           console.log(postDb);
           postStorage.add(postDb,post);
           req.session.storageP = postStorage;
           console.log(req.session.storageP);
           res.redirect('/');
        });


    },
    getPostStorage:(req,res)=>{
        console.log(req.session.storageP);
        res.json(req.session.storageP);
        // res.render('layouts/favorites',{storage:req.session.storageP});

    },
    postPage:(req,res)=>{
        const postId = req.params.id;
        Posts.find({id:postId}).exec((err,post)=>{
            if(err)  throw new Error(err);
            console.log(post);
            let data = {
              subject:post[0].subject, // first object in array [ {} ]
                text:post[0].text
            };
            res.render('layouts/postPage',data)
        })
    },

    signUp:(req,res)=>{
        let messages = req.flash('error');
        res.render('layouts/signUpPage',{csrfToken:req.csrfToken(),messages:messages, hasErrors:messages.length > 0});
    },

    singIn:(req,res)=>{
        let messages = req.flash('error');
        res.render('layouts/signInPage',{messages,csrfToken:req.csrfToken(),hasErrors:messages.length > 0});
    },

    getProfile:(req,res)=>{
        if(req.session.auth){
            let user = req.session.user.login;
            res.render('layouts/profile',{login:user});
            // res.json(user);
        }else {
            res.redirect('/user/signup');
        }
    },
    logout:(req,res)=>{
        req.session.auth = false;
        res.redirect('/');
    }

};
