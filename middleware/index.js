let post = require("../models/posts"),
    comment = require("../models/comments"),
    user = require('../models/user');

middlewareObj = {}
//checkPostOwnership middleware
middlewareObj.checkPostOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        post.findById(req.params.id, (err, post) => {
            if (err || !post) {
                req.flash("error", "Nincs ilyen bejegyzés!");
                res.redirect("back");
            } else {
                if (post.author.id.equals(req.user._id) || req.user.admin == 1 || req.user.developer == 1) {
                    next();
                } else {
                    req.flash("error", "Belépés megtagadva!");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "Kérlek jelentkezz be előbb!");
        res.redirect("back");
    }
};
//check the current loggedIn user
middlewareObj.checkLoggedInUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        user.findById(req.params.id, (err, user) => {
            if (err || !user) {
                req.flash("error", "Nincs ilyen felhasználó!");
                res.redirect("/profile/"+req.user._id);
            } else {
                if (user._id.equals(req.user._id)) {
                   next();
                } else {
                    req.flash("error", "Belépés megtagadva!");
                    res.redirect("/profile/"+req.user._id);
                }
            }
        })
    } else {
        req.flash("error", "Kérlek jelentkezz be előbb!");
        res.redirect("/login");
    }
};
//checkCommentOwnership middleware
middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        comment.findById(req.params.comment_id, (err, comment) => {
            if (err || !comment) {
                req.flash("error", "Nincs ilyen hozzászólás!");
                res.redirect("back");
            } else {
                if (comment.author.id.equals(req.user._id) || req.user.admin == 1 || req.user.developer == 1) {
                    next();
                } else {
                    req.flash("error", "Belépés megtagadva!");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "Kérlek jelentkezz be előbb!");
        res.redirect("back");
    }
};

//isLoggedIn middleware
middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Kérlek jelentkezz be előbb!");
    res.redirect("/login");
};

module.exports = middlewareObj