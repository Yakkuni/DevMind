import express from "express";
import { PalestranteControl } from "./controllers/palestrante.controller";
import { PalestranteDao } from "./dao/palestrante.dao";

const palestranteControl = new PalestranteControl(new PalestranteDao())

const app = express();
app.use(express.json());

app.post('/palestrante', (req, res)=>{
    palestranteControl.createPalestrante(req, res)
})

app.get('')

