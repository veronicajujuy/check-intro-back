import axios from "axios";
import dotenv from "dotenv";
import { repos } from "./repos.js";

dotenv.config();
const token = process.env.GITHUB_TOKEN;
// limpia la direccion y el repositorio
const obtenerUsuarioYNombreRepo = (direccion) => {
  // Eliminar el prefijo "https://github.com/" si está presente
  let direccionLimpia = direccion.replace(/^https:\/\/github.com\//, "");
  // Eliminar la extensión ".git" si está presente
  direccionLimpia = direccionLimpia.replace(/\.git$/, "");
  // Dividir la dirección en el usuario y el nombre del repositorio
  const [usuario, nombreRepo] = direccionLimpia.split("/");
  // Devolver un objeto con el usuario y el nombre del repositorio
  return { usuario, nombreRepo };
};

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
        Authorization: `Token ${token}`,
      },
    });
    // console.log(respuestaRepo)
    console.log(`El repositorio ${repo.nombreRepo} existe.`);
    existe = true;
  } catch (error) {
    console.log(`error`, error);
  }

  // Comprobar si el repositorio tiene commits
  try {
    const respuestaCommits = await axios.get(urlCommits, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    const commits = await respuestaCommits.data;
    if (commits.length === 0) {
      console.log(`El repositorio ${repo.nombreRepo} no tiene commits.`);
    } else {
      console.log(
        `El repositorio ${repo.nombreRepo} tiene ${commits.length} commits.`
      );
      hasCommits = commits.length;
    }
  } catch (error) {
    console.log(`El repositorio ${repo.nombreRepo} no existe.`);
  }

  // Comprobar si el repositorio tiene branches
  try {
    const respuestaBranches = await axios.get(urlBranches, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    const branches = await respuestaBranches.data;
    hasBranches = branches.map((branch) => branch.name);
    console.log("branches", hasBranches);
  } catch (error) {
    console.log(`El repositorio ${repo.nombreRepo} no existe.`);
  }

  let respuesta = {
    usuario: repo.usuario,
    repo: repo.nombreRepo,
    existe: existe,
    commits: hasCommits,
    branches: hasBranches,
  };
  console.log("respuesta", respuesta);
  return respuesta;
};

const resultadosGit = async () => {
  console.log("Iniciando verificación de repositorios...");

  const usuariosGit = repos.map((item) => obtenerUsuarioYNombreRepo(item));

  const resultados = await Promise.all(
    usuariosGit.map((user) => comprobarReposGit(user))
  );

  console.log("Resultados de la verificación:", resultados);
  return resultados;
};

export { resultadosGit };
