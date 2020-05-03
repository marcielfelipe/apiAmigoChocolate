const express = require('express'); 
const mongoose=require('mongoose');
const route=require('./route');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use(route);


mongoose.connect('mongodb+srv://wellington:wlborges@cluster0-zlxke.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

app.listen(process.env.PORT||3000);
//mongodb+srv://humberto:humberto@cluster0-fbd4q.azure.mongodb.net/test?retryWrites=true&w=majority+srv://wellington:wlborges@cluster0-zlxke.mongodb.net/test?retryWrites=true&w=majority
//mongodb+srv://wellington:wlborges@cluster0-zlxke.mongodb.net/test?retryWrites=true&w=majority
