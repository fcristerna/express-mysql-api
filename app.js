import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './router/index.js';

const puerto = 3006;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/', router);

app.listen(puerto, () => {
    console.log("Servidor iniciado en puerto " + puerto);
});