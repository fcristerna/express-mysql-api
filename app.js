import 'dotenv/config';
import express from 'express';
import http from "http";
import router from './router/index.js';
import path from 'path';
import alumnosDB from './models/models.js';

// generar objeto principal
const app = express();

// usar objeto router
app.use('/', router);

// iniciar servidor puerto
const puerto = 3000;
app.listen(puerto,()=>{
    console.log("se inicio servidor")
})