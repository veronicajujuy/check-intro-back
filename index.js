import {comprobarRepositorios, comprobarExistenCommits, comprobarExistenBranches} from './prueba-intro.js'
import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import {repos, limpiarRepos} from './repos.js';
import { PORT } from './config.js';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());


app.get('/', (req, res) => {
  res.send('Hola mundo!');
});

app.get('/existenRepos', async (req, res) => {
    try {
      console.log("repos", repos)
      const resultado = await comprobarRepositorios(repos);
      console.log("res",resultado)
      res.json(resultado);
    } catch (error) {
      // console.log(error);
      res.status(500).send('Hubo un error al procesar la solicitud.');
    }
  });

app.post('/envioDatos', (req, res) => {
    try{
      let respuesta = req.body.datos
      respuesta.map(item => repos.push(item))
      console.log("repos",repos)
      res.send("ok")
    }catch (error){
      console.log(error);
      res.status(500).send('Hubo un error al procesar la solicitud.');
    }
  })

  app.post('/limpiarDatos', (req, res) => {
    try{
      let respuesta = req.body
      limpiarRepos()
      res.send("ok")
    }catch (error){
      console.log(error);
      res.status(500).send('Hubo un error al procesar la solicitud.');
    }
  })

app.listen(PORT, () => {
  console.log('Servidor iniciado en el puerto ',PORT);
});