// Filtros Imágenes: Por orientación (landscape, portrait o square) o color (ej: red, orange, etc...)
// Filtros Videos: Por orientación (landscape, portrait o square) o por tamaño (ej: large, medium o small)

const APIDefecto = "https://api.pexels.com/v1/search?query=sky";
// const API = "https://api.pexels.com/videos/search?query=nature";
let datosAPI;


function crearElemento(tipo, atributos={}, clases=[]){
    let elemt = document.createElement(tipo);

    if (Object.keys(atributos).length!=0) {
        Object.entries(atributos).forEach(([clave, valor])=>{
            elemt.setAttribute(clave, valor);
        })
    }

    if (clases.length!=0) {
        elemt.classList.add(...clases);
    }

    return elemt;
}


function constructor_galeria(datosAPI){
    let imagenes = datosAPI.photos;
    let galeria = document.querySelector(".galeria");

    imagenes.forEach((imagen)=>{
        console.log(imagen.url);
        let content = crearElemento("div");
        let img = crearElemento("img", {src:imagen.url});

        galeria.append(content);
        content.append(img);
    });
}


/**
 * Permite consultar recursos de una API. La consulta se gestiona con Fetch
 * @param {String} API que se consultará
 */
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
            constructor_galeria(datosAPI);
        })

        .catch(err => {
            console.error("ERROR: ", err.message)
        });
}


/**
 * Permite marcar en qué página se está actualmente.
 */
function ubicacion() {
    if (document.querySelector("title").textContent=="Fotos") {
        document.querySelector("#videos").classList.toggle("pag-no-actual");
    }else {
        document.querySelector("#fotos").classList.toggle("pag-no-actual");
    }
}

obtenerDatos(APIDefecto);
ubicacion();