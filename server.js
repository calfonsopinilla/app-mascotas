const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname+'/dist/mascotas-app'));
app.get('/',function(req,res){
    res.sendFile(`./dist/index.hmtl`);
});

app.listen(process.env.PORT || 8080);