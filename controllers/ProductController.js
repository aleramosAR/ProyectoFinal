import carrito from "../controllers/CarritoController.js";
import fs from 'fs';
import { productosLOG, loadProducts, saveProducts } from "../fs/ProductsFS.js";

// CLASE - Genero la clase "Products" para administrar el listado de productos y su logica
class ProductController {
  constructor() {
    this.PRODUCTS = [];
    this.currentID = 0;
  }

  async productsFromFile() {
    try {
      if (fs.existsSync(productosLOG)) {
        return await loadProducts();
      }
    } catch(err) {
      return false;
    }
  }

  // Devuevo el listado completo, si el listado esta vacio devuelvo false para hacer el chequeo
  async getProds() {
    const saved = await this.productsFromFile();
    if (saved) {
      this.PRODUCTS = saved.products;
      this.currentID = saved.currentID;
    }
    return this.PRODUCTS;
  }

  // Devuelvo un producto seleccionado del listado
  selectProd(id) {
    return this.PRODUCTS.filter(prod => prod.id === parseInt(id))[0];
  }

  // Agrego un producto al listado
  async addProd(data) {
    if (data.nombre === "" || typeof data.nombre === "undefined") return false;
    if (data.precio === "" || typeof data.precio === "undefined") return false;
    if (data.foto === "" || typeof data.foto === "undefined") return false;
    this.PRODUCTS.push({
      nombre: data.nombre,
      descripcion: data.descripcion,
      codigo: data.codigo,
      foto: data.foto,
      precio: data.precio,
      stock: data.stock,
      id: this.currentID++,
      timestamp: Date.now(),
    });
    saveProducts(this.PRODUCTS, this.currentID);
    return true;
  }

  // Actualizo un producto
  updateProd(id, data) {
    // Chequeo que item del array tiene el mismo ID para seleccionarlo
    let index;
    for (let i = 0; i < this.PRODUCTS.length; i++) {
      if (this.PRODUCTS[i].id === id) {
        index = i;
        break;
      }
    };
    // Si el item existe lo reenmplazo.
    // Al product que recibo desde el body le agrego el ID correspondiente y lo grabo
    if (index != undefined) {
      data.id = id;
      data.timestamp = Date.now();
      this.PRODUCTS[index] = data;
      saveProducts(this.PRODUCTS, this.currentID);
      return data;
    };
  }

  // Elimino un producto
  deleteProd(id) {
    // Chequeo que item del array tiene el mismo ID para seleccionarlo
    let index;
    for (let i = 0; i < this.PRODUCTS.length; i++) {
      if (this.PRODUCTS[i].id === id) {
        index = i;
        break;
      }
    };
    // Si el item existe lo elimino del array.
    if (index != undefined) {
      const product = this.PRODUCTS[index];
      // LLamo a la funcion para borrar el producto del carrito
      carrito.deleteCarritoProd(product.id);
      this.PRODUCTS.splice(index, 1);
      saveProducts(this.PRODUCTS, this.currentID);
      return product;
    };
  }
}

export default new ProductController();