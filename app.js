import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './router/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const puerto = 3006;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.listen(puerto, ()=>{
    console.log("Servidor iniciado en puerto " + puerto);
});