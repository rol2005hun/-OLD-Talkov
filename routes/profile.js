let express = require("express"),
    route = express.Router({
        mergeParams: true
    }),
    user = require('../models/user'),
    post = require("../models/posts"),
    middleWare = require("../middleware");

//GET ROUTE PROFILNAK
route.get("/", middleWare.isLoggedIn, (req, res) => {
    let user_id = req.params.id;
    post.find({}).populate("comments").exec((err, posts) => {
        if (err) {
            req.flash("error", "Hiba történt! Kérlek értesíts a Discord Szerverünkön!");
            console.log(err);
        } else {
            user.findById(user_id, (err, User) => {
                if (err || !User) {
                    req.flash("error", "Nincs ilyen felhasználó!");
                    res.redirect("/posts");
                } else {
                    user.find({}, (err, users) => {
                        if (err) {
                            console.log(err);
                            res.redirect("/posts");
                        } else {
                            res.render("user/profile", {
                                posts: posts,
                                user: User,
                                users:users
                            })
                        }
                    })
                   
                }
            })

        }
    })
});

//GET ROUTE EDITELŐ PROFILNAK
route.get("/edit", middleWare.checkLoggedInUser, (req, res) => {
    user.findById(req.params.id, (err, user) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("user/edit", {
                user: user
            })
        }
    })
});

route.get("/edit-general", middleWare.checkLoggedInUser, (req, res) => {
    user.findById(req.params.id, (err, user) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("user/edit-general", {
                user: user
            })
        }
    })
});

route.get("/edit-personal", middleWare.checkLoggedInUser, (req, res) => {
    user.findById(req.params.id, (err, user) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("user/edit-personal", {
                user: user
            })
        }
    })
});

route.get("/themes", middleWare.checkLoggedInUser, (req, res) => {
    user.findById(req.params.id, (err, user) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("user/themes", {
                user: user
            })
        }
    })
});

//PUT ROUTE EDITELŐ PROFILNAK
route.put("/", middleWare.checkLoggedInUser, (req, res) => {
    user.findByIdAndUpdate(req.params.id, req.body.profile , (err, post) => {
        if (err) {
            console.log(err);
            res.redirect("/profile");
        } else {
            req.flash("succes", "A profilod sikeresen szerkesztve lett!");
            res.redirect("/profile/" + req.params.id);
        }
    })

});

route.put("/make-admin", middleWare.checkLoggedInUser, (req, res) => {
    user.findByIdAndUpdate(1, user , (err, post) => {
        if (err) {
            console.log(err);
            res.redirect("/profile");
        } else {
            req.flash("succes", "A felhasználó sikeresen Admin lett!");
            res.redirect("/profile/" + req.params.id);
        }
    })

});

route.put("/make-developer", middleWare.checkLoggedInUser, (req, res) => {
    user.findByIdAndUpdate(req.params.id, req.body.profile , (err, post) => {
        if (err) {
            console.log(err);
            res.redirect("/profile");
        } else {
            req.flash("succes", "A felhasználó sikeresen Fejlesztő lett!");
            res.redirect("/profile/" + req.params.id);
        }
    })

});

//PROFIL TÖRLÉS
route.delete("/:id", middleWare.checkLoggedInUser, (req, res) => {
    user.findByIdAndDelete(req.params.id, req.body.profile, (err, post) => {
        if (err) {
            res.redirect("/profile");
        } else {
            req.flash("succes", "A profilod sikeresen törölve lett!")
            .setTimeout(() => {
                res.redirect("/login");
            }, 3000);
        }
    })
});

module.exports = route;