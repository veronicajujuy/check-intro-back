import axios from "axios"
import {repos} from "./repos.mjs"
import { token } from "./token.mjs";

const obtenerUsuarioYNombreRepo = (direccion) => {
    // Eliminar el prefijo "https://github.com/" si está presente
    let direccionLimpia = direccion.replace(/^https:\/\/github.com\//, '');
    // Eliminar la extensión ".git" si está presente
    direccionLimpia = direccionLimpia.replace(/\.git$/, '');
    // Dividir la dirección en el usuario y el nombre del repositorio
    const [usuario, nombreRepo] = direccionLimpia.split('/');
    // Devolver un objeto con el usuario y el nombre del repositorio
    return { usuario, nombreRepo };
  }

const comprobarReposGit = async repo => {
    console.log(repo.usuario)
        const urlRepo = `https://api.github.com/repos/${repo.usuario}/${repo.nombreRepo}`;
        const urlCommits = `${urlRepo}/commits`;
        const urlBranches = `${urlRepo}/branches`;
        // const urlArchivo = `${urlRepo}/contents/ruta/al/archivo`;

        // Comprobar si el repositorio existe
        try {
            const respuestaRepo = await axios.get(urlRepo, {
            headers: {
            Authorization: `Token ${token}`
            }
        });
            console.log(`El repositorio ${repo.nombreRepo} existe.`);
            // console.log("respuesta: ", respuestaRepo); OBJETO COMPLETO

        // Comprobar si el repositorio tiene commits
        const respuestaCommits = await axios.get(urlCommits, {
             headers: {
             Authorization: `Token ${token}`
             }
        });
        const commits = respuestaCommits.data;
         if (commits.length === 0) {
            console.log(`El repositorio ${repo.nombreRepo} no tiene commits.`);
        } else {
             console.log(`El repositorio ${repo.nombreRepo} tiene ${commits.length} commits.`);
        }

        // Comprobar si el repositorio tiene branches
        const respuestaBranches = await axios.get(urlBranches, {
            headers: {
            Authorization: `Token ${token}`
            }
       });

            const branches = respuestaBranches.data;
            const hasBranches = branches.map(branch => branch.name)
            console.log(hasBranches)
   

        } catch (error) {
        console.log(`El repositorio ${repo.nombreRepo} no existe.`);
    }

}

async function comprobarRepositorios() {
    const usuariosGit = repos.map(item => {
        return obtenerUsuarioYNombreRepo(item)
    })
    console.log(usuariosGit)

  const trabajosGit = usuariosGit.map(userGit => {
        comprobarReposGit(userGit)

  })
    
}

comprobarRepositorios();
