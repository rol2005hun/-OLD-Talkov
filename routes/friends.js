let express = require("express"),
    route = express.Router(),
    post = require("../models/posts"),
    user = require("../models/user"),
    middleWare = require("../middleware");

//ÖSSZES FELHASZNÁLÓ ROUTE
route.get("/friends", middleWare.isLoggedIn, (req, res) => {
    user.find({}, (err, users) => {
        if (err) {
            console.log(err);
            res.redirect("/posts");
        } else {
            res.render("friends/index", {
                users: users,
                currentUser: req.user
            })
        }
    })
});

//BARÁTKÉRELEM ROUTE
route.put("/friends/:id/addfriend",middleWare.isLoggedIn, (req, res) => {
    user.findById(req.params.id, (err, foundUser) => {
        if (err || !foundUser) {
            req.flash("error", "Nincs ilyen felhasználó!");
            res.redirect("/friends");
        } else {
            user.findByIdAndUpdate(foundUser._id, {
                friend_requests: foundUser.friend_requests.concat([req.user._id])
            }, (err, friend) => {
                if (err) {
                    res.redirect("back");
                } else {
                    res.redirect("back");
                }
            })

        }
    })
});

//BARÁTKÉRELEM TÖRLÉSE
route.put("/friends/:firstid/removefriendrequest/:secondid",middleWare.isLoggedIn, (req, res) => {
    user.findById(req.params.firstid, (err, foundUser) => {
        if (err || !foundUser) {
            req.flash("error", "Nincs ilyen felhasználó!");
            res.redirect("/friends");
        } else {
            let updatedfriendrequests = foundUser.friend_requests.filter((val => val != req.params.secondid));
            user.findByIdAndUpdate(foundUser._id, {
                friend_requests: updatedfriendrequests
            }, (err, friend) => {
                if (err) {
                    res.redirect("back");
                } else {
                    res.redirect("back");
                }
            })
        }
    })
});

//PUT ROUTE BARÁTKÉRELEM ELFOGADÁSA
route.put("/friends/:id/acceptfriendrequest",middleWare.isLoggedIn, (req, res) => {
    user.findById(req.params.id, (err, senderUser) => {
        if (err || !senderUser) {
            req.flash("error", "Nincs ilyen felhasználó!");
            res.redirect("/friends");
        } else {
            user.findByIdAndUpdate(senderUser._id, {
                friends: senderUser.friends.concat([req.user._id])
            }, (err, friend) => {
                if (err) {
                    res.redirect("back");
                } else {
                    user.findByIdAndUpdate(req.user._id, {
                        friends: req.user.friends.concat([senderUser._id]),
                        friend_requests:req.user.friend_requests.filter((val => val != senderUser._id))
                    }, (err, recipientUser) => {
                        if (err){
                            req.flash("error", "Nincs ilyen felhasználó!");
                            res.redirect("/friends");
                        }
                        else{
                            res.redirect("back");
                        }
                    })
                }
            })

        }
    })
});

//PUT ROUTE BARÁT ELTÁVOLÍTÁSA
route.put("/friends/:id/removefriend",middleWare.isLoggedIn, (req, res) => {
    user.findById(req.params.id, (err, friend) => {
        if (err || !friend) {
            req.flash("error", "Nincs ilyen felhasználó!");
            res.redirect("/friends");
        } else {
            user.findByIdAndUpdate(friend._id, {
                friends: friend.friends.filter((val => val != req.user._id))
            }, (err, friend) => {
                if (err) {
                    res.redirect("back");
                } else {
                    user.findByIdAndUpdate(req.user._id, {
                        friends: req.user.friends.filter((val => val != req.params.id))
                    }, (err, recipientUser) => {
                        if (err){
                            req.flash("error", "Nincs ilyen felhasználó!");
                            res.redirect("/friends");
                        }
                        else{
                            res.redirect("back");
                        }
                    })
                }
            })

        }
    })
});

module.exports = route;