var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkOwner = function(req, res, next){
	if(req.isAuthenticated()){  
        Campground.findById(req.params.id, function(err, campground){
        if(err){
        		req.flash('error','Campground not found');
                res.redirect('back')
            }else{
                if(campground.author.id.equals(req.user._id)){
                    next();
                } else {
                	req.flash('error', 'Tou do not have permission');
                   res.redirect('back') 
                }
            }
        })
    }else{
    	req.flash('error', 'You need to login first');
        res.redirect('back');
    } 
}

middlewareObj.commentOwner = function(req, res, next){
     if(req.isAuthenticated()){  
        Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
                res.redirect('back')
            }else{
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else {
                	req.flash('error', 'You do not have permission');
                   res.redirect('back') 
                }
            }
        })
    }else{
    	req.flash('error', 'You need to login first')
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to login first');
    res.redirect('/login')
}

module.exports = middlewareObj;