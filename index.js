const express = require('express'); 
const mongoose=require('mongoose');
const route=require('./route');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use(route);

mongoose.connect(`mongodb+srv://marciel:senha123@amigochocolate-nk03o.mongodb.net/test?retryWrites=true&w=majority`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

app.listen(process.env.PORT||3000);
