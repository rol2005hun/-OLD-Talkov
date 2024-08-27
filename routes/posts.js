let express = require("express"),
    route = express.Router(),
    post = require("../models/posts"),
    middleWare=require("../middleware");

//GET ROUTES INDEX POSTOKHOZ
route.get("/",middleWare.isLoggedIn, (req, res) => {
    post.find({}).populate("comments").exec((err, posts)=>{
        if (err) {
            req.flash("error", "Hiba történt! Kérlek értesíts a Discord Szerverünkön!");
            console.log(err);
        } else {
            res.render("posts/index", {
                posts: posts,
                currentUser: req.user
            })
        }
    })
});

//POST ROUTE ÚJ POSTOKHOZ
route.post("/", middleWare.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let img = req.body.img;
    let desc = req.body.desc;
    post.create({
        name: name,
        img: img,
        description: desc,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }, (err, post) => {
        if (err) {
            console.log("error");
        } else {
            req.flash("succes", "A bejegyzés sikeresen elkészült!");
            res.redirect("/posts");
        }
    })

});

//GET ROUTE ÚJ POSTOKHOZ
route.get("/new", middleWare.isLoggedIn, (req, res) => {
    res.render("posts/new");
});

//GET ROUTE EDITELŐ POSTOKHOZ
route.get("/:id/edit", middleWare.checkPostOwnership, (req, res) => {
    post.findById(req.params.id, (err, post) => {
        if (err) {
            res.redirect("/posts");
        } else {
            res.render("posts/edit", {
                post: post
            })
        }
    })

});

//PUT ROUTE FOR EDITELŐ POSTOKHOZ
route.put("/:id", middleWare.checkPostOwnership, (req, res) => {
    post.findByIdAndUpdate(req.params.id, req.body.post, (err, post) => {
        if (err) {
            console.log(err)
            res.redirect("/posts");
        } else {
            req.flash("succes", "A bejegyzés sikeresen szerkesztve lett!");
            res.redirect("/posts");
        }
    })

});

//DELETE ROUTE TÖRLÉS POSTRA
route.delete("/:id", middleWare.checkPostOwnership, (req, res) => {
    post.findByIdAndDelete(req.params.id, (err, post) => {
        if (err) {
            res.redirect("/posts");
        } else {
            req.flash("succes", "A bejegyzés sikeresen törölve lett!");
            res.redirect("/posts");
        }
    })
});

module.exports = route;