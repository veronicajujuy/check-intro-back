import axios from "axios"
import dotenv from 'dotenv'
dotenv.config()
const token = process.env.GITHUB_TOKEN

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


const comprobarReposGit = async (repo) => {
        const urlRepo = `https://api.github.com/repos/${repo.usuario}/${repo.nombreRepo}`;
        let existe = false;
        let hasCommits = 0;
        let hasBranches = [];
        const urlCommits = `https://api.github.com/repos/${repo.usuario}/${repo.nombreRepo}/commits`;
        const urlBranches = `https://api.github.com/repos/${repo.usuario}/${repo.nombreRepo}/branches`;

        // Comprobar si el repositorio existe
        try {
            const respuestaRepo = await axios.get(urlRepo, {
            headers: {
            Authorization: `Token ${token}`
            }
        });
            // console.log(respuestaRepo)
            console.log(`El repositorio ${repo.nombreRepo} existe.`);
            existe = true;

        
        } catch (error) {
        console.log(`error`,error);
    }
   
    // Comprobar si el repositorio tiene commits
    try {
        const respuestaCommits = await axios.get(urlCommits, {
            headers: {
            Authorization: `Token ${token}`
            }
        });
        const commits = await respuestaCommits.data;
        if (commits.length === 0) {
            console.log(`El repositorio ${repo.nombreRepo} no tiene commits.`);
        } else {
            console.log(`El repositorio ${repo.nombreRepo} tiene ${commits.length} commits.`);
            hasCommits = commits.length;
        }
    } catch (error) {
        console.log(`El repositorio ${repo.nombreRepo} no existe.`);
    }

    // Comprobar si el repositorio tiene branches
    try{
        const respuestaBranches = await axios.get(urlBranches, {
            headers: {
            Authorization: `Token ${token}`
            }
        });
    
        const branches = await respuestaBranches.data;
        hasBranches = branches.map(branch => branch.name)
    }   catch (error) {
        console.log(`El repositorio ${repo.nombreRepo} no existe.`);
    }

    let respuesta = {
        usuario: repo.usuario,
        repo: repo.nombreRepo,
        existe: existe,
        commits: hasCommits,
        branches: hasBranches
    }
    return respuesta
}

const comprobarCommits = async repo =>{
    let hasCommits = 0;
    const urlCommits = `https://api.github.com/repos/${repo.usuario}/${repo.nombreRepo}/commits`;
    // Comprobar si el repositorio tiene commits
    try {
        const respuestaCommits = await axios.get(urlCommits, {
            headers: {
            Authorization: `Token ${token}`
            }
        });
        const commits = await respuestaCommits.data;
        if (commits.length === 0) {
            console.log(`El repositorio ${repo.nombreRepo} no tiene commits.`);
        } else {
            console.log(`El repositorio ${repo.nombreRepo} tiene ${commits.length} commits.`);
            hasCommits = commits.length;
        }
    } catch (error) {
        console.log(`El repositorio ${repo.nombreRepo} no existe.`);
    }

    let respuesta = {
        usuario: repo.usuario,
        repo: repo.nombreRepo,
        commits: hasCommits
    }
    return respuesta
}


const comprobarBranches = async repo =>{

    let hasBranches = [];
    const urlBranches = `https://api.github.com/repos/${repo.usuario}/${repo.nombreRepo}/branches`;
    // Comprobar si el repositorio tiene branches
    try{
        const respuestaBranches = await axios.get(urlBranches, {
            headers: {
            Authorization: `Token ${token}`
            }
        });
    
        const branches = await respuestaBranches.data;
        hasBranches = branches.map(branch => branch.name)
    }   catch (error) {
        console.log(`El repositorio ${repo.nombreRepo} no existe.`);
    }

    let respuesta = {
        usuario: repo.usuario,
        repo: repo.nombreRepo,
        branches: hasBranches
    }
    return respuesta
 
}




async function comprobarRepositorios(repos) {

    const usuariosGit = repos.map(item => {
        return obtenerUsuarioYNombreRepo(item)
    })
    const trabajosGit = usuariosGit.map(userGit => {
      return comprobarReposGit(userGit)
        
       })
    return Promise.all(trabajosGit)
}

async function comprobarExistenCommits(repos) {

    const usuariosGit = repos.map(item => {
        return obtenerUsuarioYNombreRepo(item)
    })
    const trabajosGit = usuariosGit.map(userGit => {
      return comprobarCommits(userGit)
        
       })
    return Promise.all(trabajosGit)
}

async function comprobarExistenBranches(repos) {

    const usuariosGit = repos.map(item => {
        return obtenerUsuarioYNombreRepo(item)
    })
    const trabajosGit = usuariosGit.map(userGit => {
      return comprobarBranches(userGit)
        
       })
    return Promise.all(trabajosGit)
}

export {comprobarRepositorios, comprobarExistenCommits, comprobarExistenBranches}