const express = require('express')

const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()

const app = express()
const port =process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ev8on.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try{
        await client.connect();
        // console.log("database connect")
        const database = client.db("travelAgent");
    const peopleCollection = database.collection("people");
    const ordersCollection=database.collection('myorder');
    const manageCollection=database.collection('manage')



     // get api 
     app.get('/people', async(req,res)=>{
        const cursor=peopleCollection.find({})
        const store=await cursor.toArray()
        res.send(store)
    });

     //    post api 
     app.post('/people',async(req,res)=>{
         const service=req.body;
         console.log('hit the post',service)
 
         const result=await peopleCollection.insertOne(service)
         console.log(result)
         res.json(result)
        // res.json('post hitten')
     });

      // update adduserpage
    app.get('/people/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id : ObjectId(id)}
        const user=await peopleCollection.findOne(query)
        console.log('load user', id)
        res.send(user)
      });

    //   add order 
    app.post('/adorder',(req,res)=>{
        // console.log(req.body);
        ordersCollection.insertOne(req.body).then((result)=>{
            res.send(result)
        })
    });

    // get my order 
    app.get('/myOrder/:email', async(req,res)=>{
        console.log(req.params.email)
        const result=await ordersCollection.find({email:req.params.email}).toArray();
        res.send(result)
    });

     // delete 
     app.delete('/myOrder/:email', async(req,res)=>{
        const id=req.params.id;
        const query={_id : ObjectId(id)};
        const result=await ordersCollection.deleteOne(query)
         console.log('delete', result);
         res.json(result)
      });

    //   managepost api 
    app.post('/people/:id',async(req,res)=>{
        const services=req.body;
        console.log('hit the post',services)

        const result=await manageCollection.insertOne(services)
        console.log(result)
        res.json(result)
       // res.json('post hitten')
    });

     // get api manage
     app.get('/people/:id', async(req,res)=>{
        const cursor=manageCollection.find({})
        const store=await cursor.toArray()
        res.send(store)
    });

    }

    finally{

    }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send("this is data")
})

app.listen(port,()=>{
    console.log('listen to port',port)
})