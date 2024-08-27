let express = require("express"),
    route = express.Router({
        mergeParams: true
    }),
    post = require("../models/posts"),
    comment = require("../models/comments"),
    middleWare=require("../middleware");

//POST ROUTE COMMENT KÉSZÍTÉSHEZ
route.post("/", middleWare.isLoggedIn, (req, res) => {
    post.findById(req.params.id, (err, post) => {
        if (err) {
            console.log(err);
            res.redirect("/posts");
        } else {
            comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Hiba történt! Kérlek értesíts a Discord Szerverünkön!");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    req.flash("succes", "Sikeres hozzászólás!");
                    res.redirect("/posts");
                }
            })
        }
    })
});

//GET ROUTE COMMENT EDITELÉSÉHEZ
route.get("/:comment_id/edit",middleWare.checkCommentOwnership,(req, res)=>{
    post.findById(req.params.id, (err, post) => {
        if (err || !post) {
            req.flash("error", "Nincs ilyen hozzászólás!");
            console.log(err);
        } else {
       
           comment.findById(req.params.comment_id, (err, comment)=>{
               if (err){
                   res.redirect("back");
               }
               else{
                
                res.render("comments/edit", {
                    post: post,
                    comment:comment
                })
               }
           })
        }
    })
});

//PUT ROUTE COMMENT EDITELÉS
route.put("/:comment_id", middleWare.checkCommentOwnership, (req, res)=>{
    comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, (err, comment)=>{
        if (err) {
            res.redirect("back");
        }
        else{
            req.flash("succes", "A hozzászólás sikeresen szerkesztve lett!");
            res.redirect("/posts");
        }
    })
});

//COMMENT TÖRLÉSE ROUTE
route.delete("/:comment_id", middleWare.checkCommentOwnership,(req, res)=>{
    comment.findByIdAndDelete(req.params.comment_id, (err, comment)=> {
        if (err) {
            res.redirect("/posts");
        } else {
            req.flash("succes", "A hozzászólás sikeresen törölve lett!");
            res.redirect("/posts");
        }
    })
});

module.exports = route;