const API = "https://api.pexels.com/v1/search?query=";
let datosAPI;


async function obtenerDatos(API) {
    fetch(API, {
        headers: {Authorization: "bt7O8cBT2GxgAPoNGeOjEHukUu3IxrVJiBTiMQg0iNTnomw6qAx6VCM9"}
    })

        // Comprobamos que no hay errores al consultar la API
        .then(respuesta => {
            if (respuesta.ok) {
                return respuesta.json();
            }else {
                // Creamos un error y automáticamente se ejecuta el catch
                throw new Error(respuesta.status);
            }
        })

        // Tomamos los datos y los guardamos en una variable global "Datos"
        .then(datos => {
            datosAPI = datos;
            console.log(datosAPI);
        })

        .catch(err => {
            console.error("ERROR: ", err.message)
        });
}

obtenerDatos(API+"nature");
