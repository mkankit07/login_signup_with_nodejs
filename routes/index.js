const express=require("express")
const router=express.Router()
const bcrypt=require("bcrypt")
const {generateToken,authenticatetoken, authenticateToken}=require('../auth/index')
const knex=require('../Database/index')


router.post('/signup',(req,res)=>{
    knex.select('*').from('test').where({  "email": req.body.email }).then((data) => {
            if((data[0].email)==req.body.email){
                res.send("email already exist")
            }}).catch((err)=>{
    knex("test")
    .insert({
        name:req.body.name,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password,10)
    })
    .then((data)=>{
        res.send({"massage":"datainsert"});
    }).catch((err)=>{
        console.log(err.massage);
})
})})

router.post("/login", (req, res) => {
    if(req.body.email === undefined || req.body.password === undefined){
        res.send({"suggetion": "email and password both are require!"})}
    else{   
    knex.select("*").from("test").where({'email':req.body.email}).then((data) => {
        console.log(data);
        var password=bcrypt.compareSync(req.body.password,data[0].password)
        console.log(password)
        if (password){
            const token=generateToken(req.body)
            res.cookie("token",token).send(data)
        }else{
            res.send("Invalid email or password")
        }
    }).catch((err) => {
        res.send(err.massage)
    })}
})


module.exports=router