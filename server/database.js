import mongoose from "mongoose";

const schema = mongoose.Schema({
    name: String,
    password: String,
});

export const User = mongoose.model('User', schema);

export const connectDB = () => {
    mongoose.connect("mongodb+srv://admin:RvdVEfgAgDraOijn@cluster0.xfwdxu4.mongodb.net/")
    .then(()=> console.log("DB Connected"))
    .catch((e)=> console.log(e));
}

