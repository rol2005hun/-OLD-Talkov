let express = require("express"),
    route = express.Router({
        mergeParams: true
    }),
    user = require("../models/user"),
    post = require("../models/posts"),
    middleWare = require("../middleware");

route.get("/adminpanel", middleWare.checkLoggedInUser, (req, res) => {
    user.findById(req.params.id, (err, user) => {
        if (err) {
            res.redirect("back");
        } else {
            if (user.admin == 1 || user.developer == 1) {
                res.render("team/adminpanel", {
                    user: user
                })
            } else {
                req.flash("error", "Belépés megtagadva!");
                res.redirect("/posts");
            }
        }
    })
});

route.get("/adminpanel", middleWare.checkLoggedInUser, (req, res) => {
    user.findById(req.params.id, (err, user) => {
        if (err) {
            res.redirect("back");
        } else {
            if (user.developer == 1) {
                res.render("team/developerpanel", {
                    user: user
                })
            } else {
                req.flash("error", "Belépés megtagadva!");
                res.redirect("/posts");
            }
        }
    })
});

module.exports = route;