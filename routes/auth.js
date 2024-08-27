let express = require("express"),
    route = express.Router(),
    user = require('../models/user'),
    passport = require('passport'),
    middleWare = require("../middleware");

//ALAP ROUTE 
route.get("/", (req, res) => {
    res.redirect("/login");
})

//CHAT ROUTEK
route.get("/globalchat",middleWare.isLoggedIn,(req,res)=> {
    res.render("chats/globalchat", {user:req.user});
})

//REGISZTRÁCIÓ ROUTEK
route.get("/register", (req, res) => {
    res.render("auth/register");
})

route.post("/register", (req, res) => {
    user.register(new user({
        username: req.body.username,
        email: req.body.email
    }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("succes", "Üdvözlünk " + user.username + " a Talkov-on!");
                res.redirect("/posts");
            })
        }
    })
});

route.get("/tos", (req, res) => {
    res.render("auth/tos");
});

//BEJELENTKEZÉS ROUTEK
route.get("/login", (req, res) => {
    res.render("auth/login");
});
route.post("/login", passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login"

}), (req, res) => {});

//LOGOUT ROUTEK
route.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "Sikeresen kijelentkeztél!");
    res.redirect("/login");
});

module.exports = route;