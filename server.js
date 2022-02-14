const { error } = require('console');
var express=require('express');
const mongoose=require('mongoose');
const validator=require('validator'); 
const FormModel = require('./FormModel');
var app=express();


app.use(express.json());

app.use(express.urlencoded({extended:true}))

// app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

const url='mongodb+srv://root:root@cluster0.4r6u9.mongodb.net/base?retryWrites=true&w=majority';
    
mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then((res)=>{
    // console.log(res);
    console.log("connected to database")
})

    
app.get('/',(req,res)=>{
res.send("Jloell");
});


app.listen(4000);

const checkvalidity = ({name,email,number}) =>
{
    
return new Promise((resolve,reject)=>
{

  if(typeof(email)!='string')
    reject("invalid email");

    if(typeof(name)!='string')
    reject("invalid name");
    
    if(typeof(number)!='bigint')
    reject("invalid number")

    if(!email||!name){
        reject("Missing Data")
    }

    //format of email abc123@xyz.com
    is(validator.isEmail(email))
    {
        reject('invalid email')
    }
    
    if(name.length<3)
    {
        reject('username too short')
    }

    if(number.length<10)
    {
        reject('Invalid Number')
    }



resolve();



})

}

app.post('/add',async(req,res)=>
{
        //assuming information received form front end 

    //destructuring
    const {name, number,email}=req.body;
 
    //Validation
    try{

        await checkvalidity({name,number,email});
    
    }

    catch{
        res.send(
            {
                status:400,
                message:"try again",
                error:err
              

            }
        )
    }
     

    //add this contact to database  
  
    let formData=new FormModel(
        {
            name,
            email,
            phone
        }
    )

    let formDb=await formData.save();
     
    res.send(
        {
            status:200,
            message:"contact  Sumbitted Suceesfully"
            
        }
    )


})



app.get('/viewall',(req,res)=>
{
    
    try{
        const formData= await FormModel.find();

        res.send(
            {
                status:200,
                message:"read successful",
                data:formData
            }
        )
    }

    catch{
        res.send(
            {
                status:401,
                message:"missing parameters"
            }
        )
    }



})



app.post('/update',async(req,res)=>
{

    let nname=req.body.id;
    let newdata=req.body.newData;

    try{

        let oldData=await FormModel.findOneAndUpdate({name:nname,newData});

        res.send(
            {
                status:200,
                message:"updated sucess",
                data:oldData
            }
        )


    }

    catch(err){
        res.send({
            status:400,
            message:"failed(database error)",
            error:err
        })

    }




})