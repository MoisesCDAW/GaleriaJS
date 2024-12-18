// Filtros Imágenes: Por orientación (landscape, portrait o square) o color (ej: red, orange, etc...)
// Filtros Videos: Por calidad (ej: sd, hd o uhd)

/**
 * Frases por defecto que cargan siempre en la misma posición en la galería.
 * Estas frases acompañan a las imágenes mostradas
 */
const frasesFotos = [
    {
        frase: "Fotos para cada necesidad, al alcance de un clic y totalmente gratuitas.",
        posicion: "1 / 1 / 2 / 2"
    },
    {
        frase: "Descubre el poder de una buena imagen para llevar tus proyectos al siguiente nivel.",
        posicion: "2 / 3 / 3 / 4"
    },
    {
        frase: "Cada imagen es una oportunidad para contar una historia, elige la tuya.",
        posicion: "4 / 3 / 5 / 4"
    },
    {
        frase: "De lo clásico a lo moderno: encuentra la foto perfecta para tu visión.",
        posicion: "5 / 1 / 6 / 2"
    }
];

/**
 * Frases por defecto que cargan siempre en la misma posición en la galería.
 * Estas frases acompañan a los videos mostrados
 */
const frasesVideos = [
    {
        frase: "Fotos para cada necesidad, al alcance de un clic y totalmente gratuitas.",
        posicion: "1 / 1 / 2 / 2"
    },
    {
        frase: "Descubre el poder de una buena imagen para llevar tus proyectos al siguiente nivel.",
        posicion: "2 / 3 / 3 / 4"
    },
    {
        frase: "Cada imagen es una oportunidad para contar una historia, elige la tuya.",
        posicion: "4 / 3 / 5 / 4"
    },
    {
        frase: "De lo clásico a lo moderno: encuentra la foto perfecta para tu visión.",
        posicion: "5 / 1 / 6 / 2"
    }
];

/**
 * API para mostrar imágenes por defecto al cargar la página en la sección "Fotos"
 */
const APIDefectoFotos = "https://api.pexels.com/v1/search?query=sky";

/**
 * API para mostrar videos por defecto al cargar la página en la sección "Videos"
 */
const APIDefectoVideos = "https://api.pexels.com/videos/search?query=sky&orientation=portrait";


/**
 * JSDoc
 */
function gestorBusquedas(){
    let texto = document.querySelector(".texto");

    // Limpia la galería para mostrar los nuevos resultados
    const limpiarGaleria = ()=>{
        document.querySelector(".galeria").remove();
        let contentGaleria = document.querySelector(".content-galeria");
        let galeria = crearElemento("div", {}, ["galeria"]);
        contentGaleria.append(galeria);
    }


    // Valida el texto introducido
    let expresion = /^[a-zA-Z]+$/;
    if (!expresion.test(texto.value)) {
        alert("Debes ingresar una palabra sin espacios ni números y solo letras");

    }else {
        limpiarGaleria();
        let API;

        // Verifica que API se debe consultar según la página en la que se haga la búsqueda
        if (document.querySelector("title").textContent=="Fotos") {
            API = "https://api.pexels.com/v1/search?query=" + texto.value;

            // Crea la galería con los datos obtenidos o lanza un mensaje de "no coincidencias"
            obtenerDatos(API).then(datosAPI => {
                if (datosAPI.photos.length!=0) {
                    crearGaleria('foto', datosAPI);
                }else {
                    alert("No se encontraron coincidencias");
                }            
            });

        }else {
            API = `https://api.pexels.com/videos/search?query=${texto.value}&orientation=portrait`;

            // Crea la galería con los datos obtenidos o lanza un mensaje de "no coincidencias"
            obtenerDatos(API).then(datosAPI => {
                if (datosAPI.videos.length!=0) {
                    crearGaleria('video', datosAPI);
                }else {
                    alert("No se encontraron coincidencias");
                }   
            });
        }
    }
}   


/**
 * Crea un nuevo elemento HTML con los atributos y clases proporcionadas.
 *
 * @function crearElemento
 * @param {string} tipo - El tipo de elemento HTML a crear (por ejemplo, 'div', 'img', 'a', etc.).
 * @param {Object} [atributos={}] - Un objeto que contiene los atributos a asignar al elemento. Las claves son los nombres de los atributos y los valores son los valores que se asignarán.
 * @param {Array<string>} [clases=[]] - Un array de cadenas con las clases CSS a agregar al elemento.
 * @returns {HTMLElement} El elemento HTML creado con los atributos y clases especificadas.
 *
 * @example
 * // Crear un <div> con una clase y un atributo
 * const div = crearElemento('div', {id: 'miDiv', title: 'Este es un div'}, ['clase1', 'clase2']);
 * document.body.append(div);
 */
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


/**
 * Agrega frases a la galería, posicionándolas según los estilos definidos en cada objeto de frase.
 * 
 * @function addFrases
 * @param {Array} frases - Un arreglo de objetos que contienen las frases y sus posiciones.
 * @property {string} frases[].frase - El texto de la frase a agregar.
 * @property {string} frases[].posicion - La posición CSS en la que se debe colocar la frase en la galería.
 */
function addFrases(frases) {
    frases.forEach((frase)=>{
        let content = crearElemento("div", {style:`grid-area: ${frase.posicion};`}, ["frases"]);
        let text = crearElemento("p", {style:"font-size: 16px;"});
        document.querySelector(".galeria").append(content);
        content.append(text);
        text.append(frase.frase);
    });
}


/**
 * Crea una galería multimedia (videos o fotos) y sus respectivas acciones (Descargar o Guardar).
 * 
 * @function crearGaleria
 * @param {string} tipo - El tipo de contenido a mostrar. Puede ser 'video' o 'foto'.
 * @param {Object} datosAPI - Objeto que contiene los datos de la API.
 * @param {Array} frases - Frases a agregar a la galería (se usa en la función addFrases).
 */
function crearGaleria(tipo, datosAPI, frases = null) {
    let galeria = document.querySelector(".galeria");

    // Determina el tipo de contenido a mostrar (video o foto)
    let elementos = tipo == 'video' ? datosAPI.videos : datosAPI.photos;

    // Construye los contenedores para cada elemento y asigna el contenido
    elementos.forEach((elemento) => {
        let content = crearElemento("div");
        let media = tipo == 'video' ? crearElemento("video", {src: elemento.video_files[1].link}, ["video"]) : crearElemento("img", {src: elemento.src.portrait}, ["foto"]);
        let accion = crearElemento("div", {}, ["accion"]);
        let descargar = crearElemento("button", {}, ["accion", "descargar"]);
        let imgDescargar = crearElemento("img", {src:"img/descargar.svg"});
        let guardar = crearElemento("button", {}, ["accion", "guardar"]);
        let imgGuardar = crearElemento("img", {src:"img/guardar.svg"});

        galeria.append(content);
        content.append(media, accion);
        accion.append(descargar, guardar);
        descargar.append(imgDescargar);
        guardar.append(imgGuardar);
    });

    // Agrega las frases según el tipo de galería
    if (frases!=null) {
        addFrases(frases);
    }
}


/**
 * Obtiene datos de una API a través de una solicitud HTTP GET utilizando Axios.
 * 
 * @async
 * @function obtenerDatos
 * @param {string} API - La URL de la API desde donde se obtendrán los datos.
 * @returns {Promise<Object|undefined>} Una promesa que se resuelve con los datos obtenidos de la API (como un objeto).
 *                                       Retorna `undefined` si ocurre un error durante la solicitud.
 * @throws {Error} Registra el error en la consola si la solicitud falla.
 */
async function obtenerDatos(API) {
    try {
        const datosAPI = await axios.get(API, {
            headers: {
                Authorization: 'bt7O8cBT2GxgAPoNGeOjEHukUu3IxrVJiBTiMQg0iNTnomw6qAx6VCM9',
            }
        });
        return datosAPI.data;
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}


/**
 * Cambia la visibilidad de las secciones de fotos y videos en función del contenido del título de la página.
 * Si el título es "Fotos", muestra la galería de fotos; si no, muestra la galería de videos.
 * 
 * Llama a la función `obtenerDatos` para obtener los datos de la API correspondiente (fotos o videos) y luego pasa esos datos a las funciones `constructor_galeriaFotos` o `constructor_galeriaVideos`.
 *
 * @function ubicacion
 * @throws {Error} Lanza un error si no encuentra los elementos con los selectores `#fotos`, `#videos` o `title` en el DOM.
 * 
 * @global {string} APIDefectoFotos - URL de la API para obtener las fotos.
 * @global {string} APIDefectoVideos - URL de la API para obtener los videos.
 */
function ubicacion() {
    if (document.querySelector("title").textContent=="Fotos") {
        document.querySelector("#videos").classList.toggle("pag-no-actual");
        obtenerDatos(APIDefectoFotos).then(datosAPI => crearGaleria('foto', datosAPI, frasesFotos));

    }else {
        document.querySelector("#fotos").classList.toggle("pag-no-actual");
        obtenerDatos(APIDefectoVideos).then(datosAPI => crearGaleria('video', datosAPI, frasesVideos));
    }
}


// ================ INICIO ===============
ubicacion();
document.querySelector(".buscar").addEventListener("click", gestorBusquedas);