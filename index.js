import { obtenerRepos } from './funciones/obtenerRepos.js';
import {comprobarRepositorios, comprobarExistenCommits, comprobarExistenBranches} from './prueba-intro.js'
import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hola mundo!');
});

app.get('/existenRepos', async (req, res) => {
    try {
      const resultado = await comprobarRepositorios();
      // console.log(resultado)
      res.json(resultado);
    } catch (error) {
      // console.log(error);
      res.status(500).send('Hubo un error al procesar la solicitud.');
    }
  });

  app.get('/existenCommits', async (req, res) => {
    try {
      const resultado = await comprobarExistenCommits();
      console.log(resultado)
      res.json(resultado);
    } catch (error) {
      console.log(error);
      res.status(500).send('Hubo un error al procesar la solicitud.');
    }
  });

  app.get('/existenBranches', async (req, res) => {
    try {
      const resultado = await comprobarExistenBranches();
      console.log(resultado)
      res.json(resultado);
    } catch (error) {
      console.log(error);
      res.status(500).send('Hubo un error al procesar la solicitud.');
    }
  });

  app.post('/envioDatos', (req, res) => {
    try{
      console.log(req.body)
      res.send("ok")
    }catch (error){
      console.log(error);
      res.status(500).send('Hubo un error al procesar la solicitud.');
    }
  })

app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});