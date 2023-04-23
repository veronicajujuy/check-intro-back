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

export {obtenerUsuarioYNombreRepo}