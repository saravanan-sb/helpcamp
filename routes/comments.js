var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');
//comment new
router.get('/new',middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        }else{
             res.render('comments/new', {campground: campground})
        }
    })
})

//comment create
router.post('/', middleware.isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
    if(err){
        console.log(err)
        res.redirect('/campgrounds')
    }else{
        Comment.create(req.body.comment, function(err,comment){
            if(err){
                console.log(err)
            }else{
                //add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username
                //save comment
                comment.save();
                campground.comments.push(comment);
                campground.save();
                req.flash('success', 'Successfully added comment');
                res.redirect('/campgrounds/'+campground._id);
            }
        })
      }
   }) 
});

//EDIT
router.get('/:comment_id/edit',middleware.commentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            res.redirect('back')
        }else{
            res.render('comments/edit',{campground_id: req.params.id, comment: comment})
        }
    })
})

//UPDATE
router.put('/:comment_id/', middleware.commentOwner,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
        if(err){
            res.redirect('back');
        }else{
            req.flash('success', 'Updated Successfully');
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

//DELETE
router.delete('/:comment_id',middleware.commentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash('error', 'Something went worng')
            res.redirect('back');
        } else {
            req.flash('success', 'Successfully deleted');
            res.redirect('back')
        }
    });
});
module.exports = router;