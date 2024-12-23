
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
        frase: "Explora una amplia variedad de videos gratuitos, perfectos para cualquier proyecto.",
        posicion: "1 / 1 / 2 / 2"
    },
    {
        frase: "Transforma tus ideas con videos impactantes que capturan la esencia de tu mensaje.",
        posicion: "2 / 3 / 3 / 4"
    },
    {
        frase: "Cada video tiene el poder de transmitir emociones, elige el que conecte con tu audiencia.",
        posicion: "4 / 3 / 5 / 4"
    },
    {
        frase: "Desde contenido inspirador hasta tutoriales prácticos: encuentra el video ideal para ti.",
        posicion: "5 / 1 / 6 / 2"
    }
];


/**
 * API para mostrar imágenes por defecto al cargar la página en la sección "Fotos"
 */
const APIDefectoFotos = "https://api.pexels.com/v1/search?query=mountain";

/**
 * API para mostrar videos por defecto al cargar la página en la sección "Videos"
 */
const APIDefectoVideos = "https://api.pexels.com/videos/search?query=sky&orientation=landscape";


/**
 * Borra el contenedor "galería" y lo vuelve a crear dentro del contenedor ".content-galeria".
 *
 * @function limpiarGaleria
 */
function limpiarGaleria() {
    document.querySelector(".galeria").remove();
    let contentGaleria = document.querySelector(".content-galeria");
    let nuevaGaleria = crearElemento("div", {}, ["galeria"]);;
    contentGaleria.append(nuevaGaleria);
}


/**
 * Borra un recurso (foto o video) de la galería de guardados y lo elimina del almacenamiento local ("localStorage").
 * Dependiendo del tipo de recurso ("foto" o "video"), se elimina de la lista correspondiente en "localStorage".
 * Después de eliminar el recurso, la página se recarga para reflejar los cambios.
 * 
 * @function borrarRecurso
 * @param {Event} recurso - El evento que contiene el recurso a borrar. El recurso debe tener la propiedad `target.id`,
 * que es el ID del recurso (foto o video) que se va a eliminar.
 * 
 * @param {string} tipo - El tipo de recurso que se va a borrar. Puede ser "foto" o "video", y determina de qué lista 
 * (fotos o videos) se debe eliminar el recurso.
 * 
 */
function borrarRecurso(recurso, tipo) {
    // Obtener los recursos guardados en localStorage
    let recursos = localStorage.getItem("recursos");
    
    // Si hay recursos guardados, procede a eliminarlos
    if (recursos) {
        recursos = JSON.parse(recursos);

        if (tipo=="foto") {
            for (let i = 0; i < recursos.fotos.length; i++) {
                if (recursos.fotos[i][0]==recurso.target.id) {
                    recursos.fotos.splice(i, 1); // Eliminar el recurso de la lista de fotos
                }
            }
        }else {
            for (let i = 0; i < recursos.videos.length; i++) {
                if (recursos.videos[i][0]==recurso.target.id) {
                    recursos.videos.splice(i, 1); // Eliminar el recurso de la lista de videos
                }
            }
        }
    }

    // Actualiza la lista de recursos guardada en "localStorage"
    recursos = JSON.stringify(recursos);
    localStorage.setItem("recursos", recursos);

    // Actualiza la página para reflejar los cambios
    location.reload();
}


/**
 * Desmarca un recurso (foto o video) en la interfaz de usuario, reemplazando la imagen de "guardado" 
 * por la imagen de "guardar" y habilitando nuevamente el botón para permitir marcarlo. 
 * También elimina el recurso del almacenamiento en "localStorage" en la categoría correspondiente (fotos o videos).
 * 
 * @function desmarcarRecurso
 * @param {Event} recurso - El evento que contiene el recurso a desmarcar.
 * El recurso debe tener la propiedad "target.id", que es el ID del recurso (foto o video).
 */
function desmarcarRecurso(recurso) {
    let recursos = localStorage.getItem("recursos");
    let pagina = document.querySelector("title").textContent;
    let recursoID = recurso.target.id;

    // Obtiene el botón del recurso en el DOM y reemplaza la imagen de "guardado" por "guardar"
    let boton = document.querySelector("[id='"+recursoID+"']").parentNode;
    let nuevaImg = crearElemento("img", {src: "img/guardar.svg", id:recursoID});

    // Elimina la imagen de "guardado" y agregar la imagen de "guardar"
    document.querySelector("[id='"+recursoID+"']").remove();
    boton.append(nuevaImg);

    // Añade un evento para volver a marcar el recurso
    nuevaImg.addEventListener("click", marcarRecurso);
    
    // Si hay recursos en "localStorage", borra el que se desmarcó
    if (recursos) {
        recursos = JSON.parse(recursos);

        if (pagina=="Fotos") {
            for (let i = 0; i < recursos.fotos.length; i++) {
                if (recursos.fotos[i][0]==recursoID) {
                    recursos.fotos.splice(i, 1);
                }
            }
        }else {
            for (let i = 0; i < recursos.videos.length; i++) {
                if (recursos.videos[i][0]==recursoID) {
                    recursos.videos.splice(i, 1);
                }
            }
        }
    }

    // Actualiza la lista de recursos guardada en "localStorage"
    recursos = JSON.stringify(recursos);
    localStorage.setItem("recursos", recursos);
}


/**
 * Actualiza los recursos marcados (fotos o videos) en la interfaz de usuario.
 * Obtiene los recursos guardados en "localStorage" y dependiendo de la página actual (Fotos o Videos),
 * marca los recursos correspondientes, cambiando el icono a uno de "guardado" y deshabilitando el botón.
 * 
 * @function marcadores
 */
function marcadores() {
    let recursos = localStorage.getItem("recursos");
    let pagina = document.querySelector("title").textContent;

    /* Marca un recurso en la interfaz de usuario, reemplazando el botón con una imagen de "guardado"
    y deshabilitando el botón para evitar interacciones adicionales. */
    let marcar = (recursoID)=>{
        let boton = document.querySelector("[id='"+recursoID+"']");

        if (boton) {
            boton = boton.parentNode;
            let nuevaImg = crearElemento("img", {src: "img/guardado.svg", id:recursoID});

            // Elimina la imagen orignal del botón
            document.querySelector("[id='"+recursoID+"']").remove();
            
            // Añade la nueva imagen de guardado y deshabilita el botón
            boton.append(nuevaImg);
            boton.setAttribute("disabled", "disabled");

            // Añade un evento para desmarcar el recurso cuando se haga clic en la imagen
            nuevaImg.addEventListener("click", desmarcarRecurso);
        }
    }

    // Si hay recursos guardados, se marcan como guardados con la respectiva img
    if (recursos) {
        recursos = JSON.parse(recursos);

        if (pagina=="Fotos") {
            recursos.fotos.forEach((foto)=>marcar(foto[0]));
        }else {
            recursos.videos.forEach((video)=>marcar(video[0]));
        }
    }
}


/**
 * Marca un recurso (foto o video) y lo guarda en el "localStorage" en la sección correspondiente
 * (fotos o videos) dependiendo de la página actual. Si no hay recursos previamente guardados,
 * crea una nueva estructura de almacenamiento en "localStorage" para fotos o videos.
 * Luego, actualiza la vista llamando a la función "marcadores()".
 *
 * @function marcarRecurso
 * @param {Event} recurso - El evento que contiene el recurso que se va a marcar.
 * El recurso debe tener las propiedades "target.id" (el ID del recurso) y "target.title" (el título del recurso).
 * 
 */
function marcarRecurso(recurso) {
    let recursos = localStorage.getItem("recursos");
    let elemento = [recurso.target.id, recurso.target.title, recurso.target.alt];

    // Obtener el título de la página actual para determinar si es la página de fotos o videos
    let pagina = document.querySelector("title").textContent;

    if (!recursos) {

        // Si estamos en la página de "Fotos", se agrega el recurso a la lista de fotos
        if (pagina=="Fotos") {
            recursos = {
                fotos: [elemento],
                videos: []
            }
        }else { // De lo contrario, se agrega el recurso a la lista de videos
            recursos = {
                fotos: [],
                videos: [elemento]
            }
        }

    }else {
        recursos = JSON.parse(recursos);

        // Agregar el recurso a la lista correspondiente según la página
        if (pagina=="Fotos") {
            recursos.fotos.push(elemento);
        }else {
            recursos.videos.push(elemento);
        }
    }

    // Convertir la estructura de recursos de nuevo a JSON y guardarla en localStorage
    recursos = JSON.stringify(recursos);
    localStorage.setItem("recursos", recursos);

    // Llamar a la función marcadores() para actualizar la vista
    marcadores();
}


/**
 * Función que carga los recursos guardados desde el `localStorage` y los muestra en una galería correspondiente.
 * Para cada tipo de recurso (foto o video), se crea un contenedor con la opción de descargar o borrar.
 * 
 * @function guardados
 */
function guardados() {

    // Genera los elementos HTML necesarios para mostrar el contenido de los recursos guardados.
    let galeriaGuardados = (elementos, galeria, tipo)=>{
        elementos.forEach((elemento) => {
            let content = crearElemento("div");
            let media = tipo == 'video' ? crearElemento("video", {src: elemento[1], loading:"lazy"}, ["video"]) : crearElemento("img", {src: elemento[1], loading:"lazy"}, ["foto"]);
            let accion = crearElemento("div", {}, ["accion"]);
            let descargar = tipo == 'video' ? crearElemento("a", {href:elemento[2]}, ["descargar"]) : crearElemento("a", {href:elemento[2]}, ["descargar"]);
            let imgDescargar = crearElemento("img", {src:"img/descargar.svg", id:elemento[0]});
            let borrar = crearElemento("button", {}, ["borrar"]);
            let imgBorrar = crearElemento("img", {src:"img/papelera.svg", id:elemento[0]});
    
            galeria.append(content);
            content.append(media, accion);
            accion.append(descargar, borrar);
            descargar.append(imgDescargar);
            borrar.append(imgBorrar);

            // Se agrega el evento para borrar el recurso
            borrar.addEventListener("click", (recurso)=>{
                borrarRecurso(recurso, tipo);
            });
        });
    };

    
    // Recupera los recursos del localStorage
    let recursos = localStorage.getItem("recursos");

    if (!recursos) {
        console.log("Vacío");
    }else {
        recursos = JSON.parse(recursos);
        let galeria;

        // Si hay fotos guardadas, las agrega a la galería de fotos
        if (recursos.fotos.length!=0) {
            galeria = document.querySelector("[class~='galeria-fotos']");
            galeriaGuardados(recursos.fotos, galeria, "foto");
        }

        // Si hay videos guardados, los agrega a la galería de videos
        if (recursos.videos.length!=0) {
            galeria = document.querySelector("[class~='galeria-videos']");
            galeriaGuardados(recursos.videos, galeria, "video");
        }
    }
}


/**
 * Maneja los accesos rápidos a recursos como fotos o videos según el elemento sobre el que se haga clic.
 * 
 * La función busca el tipo de recurso (por ejemplo, "paisajes", "negocios", etc.) según la clase del elemento
 * clickeado. Luego, dependiendo de la página actual (fotos o videos), construye la URL adecuada para buscar
 * en la API de Pexels y actualiza la galería con los resultados correspondientes.
 * 
 * @function accesosRapidos
 * @param {Event} elemento - utiliza para determinar qué tipo de recurso buscar (por ejemplo, 
 *                          fotos o videos de paisajes, negocios, etc.).
 * 
 */
function accesosRapidos(elemento){
    let recursosABuscar;

    // Busca que tipo de recursos hay que buscar según la clase del elemento. Ej.: paisajes, negocios, etc.
    if (elemento.target.className != "accesos-rapidos") {
        if (elemento.target.tagName=="DIV") {
            recursosABuscar = elemento.target.querySelector("img").className;
        }else {
            recursosABuscar = elemento.target.className;
        }
    }

    // Verificamos que tipo de página es la actual, si de fotos o videos.
    let pagina = document.querySelector("title").textContent; 
    let API;

    limpiarGaleria(); // Borra los recursos de la anterior búsqueda

    if (pagina=="Fotos") {
        API = "https://api.pexels.com/v1/search?query=" + recursosABuscar;
        obtenerDatos(API).then(datosAPI => crearGaleria('foto', datosAPI));
    }else {
        API = `https://api.pexels.com/videos/search?query=${recursosABuscar}&orientation=landscape`;
        obtenerDatos(API).then(datosAPI => crearGaleria('video', datosAPI));
    }
}


/**
 * Gestiona las búsquedas de fotos o videos a través de una barra de búsqueda.
 * 
 * La función valida el texto ingresado por el usuario, asegurándose de que solo contenga letras (sin espacios ni números).
 * Si el texto es válido, la función realiza una búsqueda en la API de Pexels según la página actual (Fotos o Videos).
 * Si se encuentran resultados, actualiza la galería con las fotos o videos obtenidos. Si no hay resultados, 
 * muestra un mensaje de "no coincidencias".
 * 
 * @function gestorBusquedas
 */
function gestorBusquedas(){
    let texto = document.querySelector(".texto");

    // Valida el texto introducido
    let expresion = /^[a-zA-Z]+$/;
    if (!expresion.test(texto.value)) {
        alert("Debes ingresar una palabra sin espacios ni números y solo letras");
        console.log(document.querySelector(".selector-filtro").value);

    }else {
        let API;
        let filtro = document.querySelector(".selector-filtro").value;

        // Verifica que API se debe consultar según la página en la que se haga la búsqueda
        if (document.querySelector("title").textContent=="Fotos") {

            if (filtro!="null") {
                API = `https://api.pexels.com/v1/search?query=${texto.value}&color=${filtro}`;
            }else {
                API = `https://api.pexels.com/v1/search?query=${texto.value}`;
            }

            // Crea la galería con los datos obtenidos o lanza un mensaje de "no coincidencias"
            obtenerDatos(API).then(datosAPI => {
                if (datosAPI.photos.length!=0) {
                    limpiarGaleria();
                    crearGaleria('foto', datosAPI);
                }else {
                    alert("No se encontraron coincidencias");
                }            
            });

        }else {

            if (filtro!="null") {
                API = `https://api.pexels.com/videos/search?query=${texto.value}&orientation=landscape&size=${filtro}`;
            }else {
                API = `https://api.pexels.com/videos/search?query=${texto.value}&orientation=landscape`;
            }
            

            // Crea la galería con los datos obtenidos o lanza un mensaje de "no coincidencias"
            obtenerDatos(API).then(datosAPI => {
                if (datosAPI.videos.length!=0) {
                    limpiarGaleria();
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
 * @function agregarFrases
 * @param {Array} frases - Un arreglo de objetos que contienen las frases y sus posiciones.
 * @property {string} frases[].frase - El texto de la frase a agregar.
 * @property {string} frases[].posicion - La posición CSS en la que se debe colocar la frase en la galería.
 */
function agregarFrases(frases) {
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
 * @param {Array} frases - Frases a agregar a la galería (se usa en la función agregarFrases).
 */
function crearGaleria(tipo, datosAPI, frases = null) {
    let galeria = document.querySelector(".galeria");

    // Determina el tipo de contenido a mostrar (video o foto)
    let elementos = tipo == 'video' ? datosAPI.videos : datosAPI.photos;

    // Construye los contenedores para cada elemento y asigna el contenido
    elementos.forEach((elemento) => {
        let content = crearElemento("div");
        let media = tipo == 'video' ? crearElemento("video", {src: elemento.video_files[1].link, loading:"lazy"}, ["video"]) : crearElemento("img", {src: elemento.src.portrait, loading:"lazy"}, ["foto"]);
        let accion = crearElemento("div", {}, ["accion"]);
        let descargar = tipo == 'video' ? crearElemento("a", {href:elemento.url}, ["descargar"]) : crearElemento("a", {href:elemento.url}, ["descargar"]);
        let imgDescargar = crearElemento("img", {src:"img/descargar.svg"});
        let guardar = crearElemento("button", {}, ["guardar"]);
        let imgGuardar = tipo == 'video' ? crearElemento("img", {src:"img/guardar.svg", title: elemento.video_files[1].link, id:elemento.id, alt:elemento.url}) : crearElemento("img", {src:"img/guardar.svg", title: elemento.src.portrait, id:elemento.id, alt:elemento.url});

        galeria.append(content);
        content.append(media, accion);
        accion.append(descargar, guardar);
        descargar.append(imgDescargar);
        guardar.append(imgGuardar);
    });

    // Agrega las frases según el tipo de galería
    if (frases!=null) {
        agregarFrases(frases);
    }

    gestorEventos(); // Para asignar los eventos
    marcadores();
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

    }else if(document.querySelector("title").textContent=="Videos"){
        document.querySelector("#fotos").classList.toggle("pag-no-actual");
        obtenerDatos(APIDefectoVideos).then(datosAPI => crearGaleria('video', datosAPI, frasesVideos));
    }else {
        guardados();
    }
}


/**
 * Gestiona los eventos principales de la web.
 * 
 * La función agrega los siguientes manejadores de eventos:
 * 1. **submit** al formulario ".form-busqueda" para evitar que se recargue la página al enviar el formulario.
 * 2. **click** al botón ".buscar" para activar la función "gestorBusquedas" cuando se haga clic.
 * 3. **click** a los elementos ".accesos-rapidos" para activar la función "accesosRapidos" al hacer clic en un acceso rápido.
 * 4. **click** al botón "guardados" para ir a la sección de recursos guardados
 * 
 * @function gestorEventos
 */
function gestorEventos() {
    document.querySelector(".form-busqueda").addEventListener("submit", (evento)=>evento.preventDefault());
    document.querySelector(".buscar").addEventListener("click", gestorBusquedas);
    document.querySelector(".accesos-rapidos").addEventListener("click", accesosRapidos);
    document.querySelectorAll(".guardar").forEach((x)=>x.addEventListener("click", marcarRecurso));
    
}


// ================ INICIO ===============
ubicacion(); // Para imprimir recursos según el tipo de página
// localStorage.clear();