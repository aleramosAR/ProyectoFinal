const socket = io.connect();
const getUrl = window.location;
const baseUrl = getUrl.protocol + "//" + getUrl.host;
const errormsg = "Hubo un problema con la petición Fetch: ";

// Al agregar productos recibo el evento 'listProducts' desde el server y actualizo el template
// Para ver los cambios en la tabla
socket.on('listProducts', async (data) => {
  const { productos, admin } = data;
  const archivo = await fetch('plantillas/listado.hbs');
  const archivoData = await archivo.text();
  const template = Handlebars.compile(archivoData);
  const result = template({productos, admin});
  document.getElementById('productos').innerHTML = result;
});

socket.on('listCarrito', async (data) => {
  const { carrito, admin } = data;
  const archivo = await fetch('plantillas/tabla.hbs');
  const archivoData = await archivo.text();
  const template = Handlebars.compile(archivoData);
  const result = template({carrito, admin});
  document.getElementById('tabla').innerHTML = result;
});

// Callback del boton submit, chequea que el form este completo y llama a la API
// Si todo esta bien emite el evento 'postProduct' al Websocket avisando que se agrego un producto nuevo
const crearProducto = () => {
  if (nombre.value == '' || descripcion.value == '' || precio.value == '' || foto.value == '' || codigo.value == '' || stock.value == '') {
    alert('Por favor llena el formulario.')
  } else {
    const newProd = {
      "nombre": nombre.value,
      "descripcion": descripcion.value,
      "precio": precio.value,
      "foto": foto.value,
      "codigo": codigo.value,
      "stock": stock.value
    };

    enviarDatos(`${baseUrl}/api/productos`, newProd)
    .then(() => {
      nombre.value = "";
      descripcion.value = "";
      precio.value = "";
      foto.value = "";
      codigo.value = "";
      stock.value = "";
      socket.emit('postProduct');
    }).catch(error => {
      console.log(errormsg + error.message);
    });
  }
  return false;
}

const actualizarProducto = (id) => {
  if (nombre.value == '' || descripcion.value == '' || precio.value == '' || foto.value == '' || codigo.value == '' || stock.value == '') {
    alert('Por favor llena el formulario.')
  } else {
    const newProd = {
      "nombre": nombre.value,
      "descripcion": descripcion.value,
      "precio": precio.value,
      "foto": foto.value,
      "codigo": codigo.value,
      "stock": stock.value
    };
    actualizarDatos(`${baseUrl}/api/productos/actualizar/${id}`, newProd)
    .then(() => {
      window.location.replace("/productos");
    }).catch(error => {
      console.log(errormsg + error.message);
    });
  }
  return false;
}

// Funcion para hacer el POST de datos
const enviarDatos = async(url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Funcion para hacer el POST de datos
const actualizarDatos = async(url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

const clickDelete = (id) => {
  prodDelete(`${baseUrl}/api/productos/borrar/${id}`)
  .then(() => {
    socket.emit('removeProduct');
  }).catch(error => {
    console.log(errormsg + error.message);
  });
  return false;
}

// Funcion para hacer el DELETE de producto
const prodDelete = async(url = '', id = {}) => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

const clickAgregarCarrito = (id) => {
  prodAgregarCarrito(`${baseUrl}/api/carrito/agregar/${id}`)
  .then(() => {
    location.href = '/carrito';
  }).catch(error => {
    console.log(errormsg + error.message);
  });
  return false;
}

// Funcion para hacer el DELETE de producto
const prodAgregarCarrito = async(url = '', id = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

const clickDeleteCarrito = (id) => {
  prodDeleteCarrito(`${baseUrl}/api/carrito/borrar/${id}`)
  .then(() => {
    socket.emit('removeCarritoProduct');
  }).catch(error => {
    console.log(errormsg + error.message);
  });
  return false;
}

// Funcion para hacer el DELETE de producto
const prodDeleteCarrito = async(url = '', id = {}) => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}