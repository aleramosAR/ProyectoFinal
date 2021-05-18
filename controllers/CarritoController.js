import stock  from "../controllers/ProductController.js";
import fs from 'fs';
import { carritoLOG, loadCarrito, saveCarrito } from "../fs/CarritoFS.js";
import { formatDate } from '../utils/utils.js'

// CLASE - Genero la clase "Products" para administrar el listado de productos y su logica
class CarritoController {
  constructor() {
    if (!this.CARRITO) {
      this.CARRITO = {
        "id": 0,
        "timestamp": new Date(),
        "productos": []
      };
    }
  }

  async carritoFromFile() {
    try {
      if (fs.existsSync(carritoLOG)) {
        const carrito = await loadCarrito();
        return carrito;
      }
    } catch(err) {
      return false;
    }
  }
  
  // Devuelvo el carrito completo
  async getCarrito() {
    const saved = await this.carritoFromFile();
    if (saved) {
      this.CARRITO = saved;
    }
    const date = new Date(this.CARRITO.timestamp);
    const tempcarrito = {
      "id": this.CARRITO.id,
      "timestamp": formatDate(date),
      "productos": this.CARRITO.productos
    }
    if (saved) {
      const carritoprods = [];
      const initialProducts = await stock.getProds();
      this.CARRITO.productos.forEach(x => carritoprods.push(initialProducts.filter(prod => prod.id === x)[0]));
      tempcarrito.productos = carritoprods;
    }
    return tempcarrito;
  }

  // Devuevo el listado completo, si el listado esta vacio devuelvo false para hacer el chequeo
  getCarritoProds() {
    if (this.CARRITO.productos.length == 0) {
      return false;
    }
    const carritoprods = [];
    this.CARRITO.productos.forEach(x => carritoprods.push(stock.getProds().filter(prod => prod.id === x)[0]));
    return carritoprods;
  }

  // Devuelvo un determinado producto del carrito.
  getCarritoProd(id) {
    // Si el producto no esta en el carrito devuelvo error, caso contrario devuelvo el detalle del producto
    if (!this.CARRITO.productos.includes(parseInt(id))) {
      return false;
    }
    return stock.selectProd(id);
  }

  // Agrego un producto al carrito
  addCarritoProd(id) {
    if(!this.CARRITO.productos.includes(Number(id))) {
      const producto = stock.selectProd(id);
      if (producto) {
        this.CARRITO.productos.push(parseInt(id));
        saveCarrito(this.CARRITO);
        return producto;
      }
      return false;
    }
    return { error: "Producto ya existente en el carrito." };
  }

  // Elimino un producto del carrito
  deleteCarritoProd(id) {
    // Chequeo que item del array tiene el mismo ID para seleccionarlo
    let index;
    const productosList = this.CARRITO.productos;
    for (let i = 0; i < productosList.length; i++) {
      if (productosList[i] === id) {
        index = i;
        break;
      }
    };
    // Si el item existe lo elimino del carrito.
    if (index != undefined) {
      const producto = this.getCarritoProd(productosList[index]);
      productosList.splice(index, 1);
      saveCarrito(this.CARRITO);
      return producto;
    };
  }

}

export default new CarritoController();