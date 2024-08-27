let mongoose = require("mongoose"),
    passportlocalmongoose = require("passport-local-mongoose");

let UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    vip: {
        default: false
    },
    admin: {
      default: false
    },
    developer: {
      default: false
    },  
    firstname: {
        type: String,
        default: "Vezetéknév"
      },
    lastname: {
        type: String,
        default: "Keresztnév"
      },
    bio: {
        type: String,
        default: "Bio"
      },
    hometown: {
        type: String,
        default: "Nincs információ"
      },
    workplace: {
        type: String,
        default: "Nincs információ"
      },
    education: {
        type: String,
        default: "Nincs információ"
      },
    contact: {
        type: String,
        default: "Telefonszám: 999999999, email: alap@alap.com"
      },
    password: String,
    friends:[{type:String}],
    friend_requests:[{type:String}],
    banned: {
      type: String,
      default: false
    }
})

UserSchema.plugin(passportlocalmongoose);
module.exports = mongoose.model("user", UserSchema);
