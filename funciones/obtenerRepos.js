import { obtenerUsuarioYNombreRepo } from "./limpiarRepos.js";
import { repos } from "../repos.js";

async function obtenerRepos() {

    const usuariosGit = repos.map(item => {
        return obtenerUsuarioYNombreRepo(item)
    })
    console.log(usuariosGit)
    return usuariosGit;
}

export {obtenerRepos}