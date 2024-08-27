let express = require("express"),
    route = express.Router(),
    post = require("../models/posts"),
    middleWare = require("../middleware");

//PUT ROUTE LIKE FRISSITÉSÉHEZ
route.put("/posts/:id/like", middleWare.isLoggedIn, (req, res) => {
    post.findById(req.params.id, (err, postupdate) => {
        if (err) {
            req.flash("error", "Nincs ilyen bejegyzés!");
            res.redirect("/posts");
        } else {
            //új likeokhoz
            if (postupdate.likes.find(event => event == req.user._id)) {
                let updatedlikes = postupdate.likes.filter((val => val != req.user._id));
                post.findByIdAndUpdate(postupdate._id, {
                    likes: updatedlikes
                }, (err, like) => {
                    if (err) {
                        console.log(err);
                        res.redirect("back");
                    } else {
                        res.redirect("back");
                    }
                })

            }
            //meglévő likeokhoz
            else {
                post.findByIdAndUpdate(postupdate._id, {
                    likes: postupdate.likes.concat([req.user._id])
                }, (err, like) => {
                    if (err) {
                        console.log(err)
                        res.redirect("back");
                    } else {
                        res.redirect("back");
                    }
                })
            }

        }
    })

});

module.exports = route;