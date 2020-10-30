const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');



// @route   post api/posts
//@desc  create post
// @access private


router.post('/',[ auth, [
    check('text', 'Text is required')
    .not()
    .isEmpty()
]
 ],
 async (req, res) => {
     const errors = validationResult(req);
     if(!errors.isEmpty()) {
         return res.status(400).json({errors: errors.array()});


     }

     try {
        const user =  await User.findById(req.user.id).select('-password');
     
        const  newPost = new Post ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        
      const post = await newPost.save();
      res.json(post);
     }catch(err) {
         console.error(err.message);
         res.status(500).send('Server error');


     }

      

});

// @route   get api/post
//@desc  get all post
// @access private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    }catch(err) {
        console.error(err.message);
         res.status(500).send('Server error');

    }
});

// @route   get api/post/:id
//@desc  get  post by id
// @access private

router.get('/:id', auth , async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({msg:'Post not found'})

        }
        res.json(post);
     

    }catch(error) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg:'Post HELL found'})

        }
         res.status(500).send('Server error');

    }
});

// @route   delete api/post/:id
//@desc  delete post by id
// @access private

router.delete('/:id',auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(401).json({msg:'User not Authorized'});
// check user
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({msg:'User not Authorized'});

        }
        await post.remove();
        res.json({msg:'Post removed'});
     
    }catch(error) {
        console.error(err.message);
        if (err.kind=== 'ObjectId') {
            return res.status(404).json({msg:'Post not found'})

        }
         res.status(500).send('Server error');

    }
})

// @route   put api/post/like/:id
//@desc  like a post post by id
// @access private
router.put('/like/:id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // check if already liked by user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.json(400).json({msg: 'Post already liked'});

        }

       post.likes.unshift({user: req.user.id});
       await post.save(); 


    }catch(error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route   put api/post/UNlike/:id
//@desc  like a post post by id
// @access private
router.put('/unlike/:id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // check if already liked by user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.json(400).json({msg: 'Post has not yet been liked'});

        }

       // get remove index
       const removeIndex = post.likes
       .map(like => like.user.toString())
       .indexOf(req.user.id);
       post.like.splice(removeIndex, 1);
       await post.save(); 


    }catch(error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});


// @route   post api/post/comments:id
//@desc  comment on a post 
// @access private


router.post('/comment/:id',[auth,[
    check('text', 'Text is required')
    .not()
    .isEmpty()
]
 ],
 async (req,res)=> {
     const errors = validationResult(req);
     if(!errors.isEmpty()) {
         return res.status(400).res.json({errors: errors.array()});


     }

     try {
        const user =  await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
     
        const newComment =  ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        post.comments.unshift(newComment);
        
      await post.save();

      res.json(post.comments);
     }catch(err) {
         console.error(err.message);
         res.status(500).send('Server error');


     }

      

});

// @route   DELETE api/post/comments:id/:COMMENT_ ID
//@desc  DELETE comment on a post 
// @access private

router.delete('/comment/:id/:comment_id', auth, async(req, res) => {
    try {
      const post = await Post.findById(req.params.id)   
     //pull out comment
     const comment = post.comment.find(comment => comment.id === req.params.comment_id );
     // make sure comments exist 

     if (!comment) {
       return res.status(404).json({msg:'Comment does not exist'});  
     }
     // check user

     if(comment.user.toString() !== req.user.id) {
         return res.status(401).json({msg: 'User not Authorized'});


     }

     const removeIndex = post.comments
       .map(comment => comment.user.toString())
       .indexOf(req.user.id);
       post.comment.splice(removeIndex, 1);
       await post.save(); 

       res.json(post.comments);



    }catch(err) {
        console.error(err.message);
         res.status(500).send('Server error');

    }

});





module.exports = router;