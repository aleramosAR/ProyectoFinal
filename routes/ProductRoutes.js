import express from "express";
import stock from "../controllers/ProductController.js";

const router = express.Router();
router.use(express.json());

// Cargo el listado de productos, devuelvo un mensajes si el listado esta vacio (devuelve false)
router.get("/", (req, res) => {
  (async ()=>{
    const prods = await stock.getProds();
    if (!prods) {
      return res.status(404).json({
        error: "No hay productos cargados.",
      });
    }
    res.json(prods);
  })()
});

// Devuelvo un determinado producto
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const prod = stock.selectProd(id);
  if (prod) {
    return res.json(prod);
  }
  res.status(404).json({
    error: "Producto no encontrado."
  });
});

// Agrego un producto
router.post("/", (req, res) => {
  // Si el usuario no es administrador no se agrega el producto.
  if (!admin) {
    return res.status(403).json(
      { error : -1, descripcion: "Ruta /productos, metodo 'agregar' no autorizado"}
    );
  }
  const product = req.body;
  if (stock.addProd(product)) {
    res.status(201).json(product);
  }
  res.status(400).send();
});

// Actualizo un producto
router.put("/actualizar/:id", (req, res) => {
  // Si el usuario no es administrador no se permite la actualizacion.
  if (!admin) {
    return res.status(403).json(
      { error : -1, descripcion: "Ruta /productos, metodo 'actualizar' no autorizado"}
    );
  }
  const { id } = req.params;
  const product = req.body;

  // Ejecuto el update y recibo la respuesta en una variable.
  // Si el producto que intente actualizar existe lo devuelvo con un status 200.
  // Si el producto que intente actualizar no existe devuelvo un error con un status 404.
  const prod = stock.updateProd(parseInt(id), product);
  if (prod) {
    return res.status(200).json(prod);
  }
  res.status(404).json({
    error: "Producto no encontrado."
  });
});

// Elimino un producto
router.delete("/borrar/:id", (req, res) => {
  // Si el usuario no es administrador no se elimina el producto.
  if (!admin) {
    return res.status(403).json(
      { error : -1, descripcion: "Ruta /productos, metodo 'borrar' no autorizado"}
    );
  }
  const { id } = req.params;

  // Elimino el producto segun el id que se paso y recibo la respuesta en una variable.
  // Si el producto que intente eliminar existe lo devuelvo con un status 200.
  // Si el producto que intente eliminar no existe devuelvo un error con un status 404.
  const prod = stock.deleteProd(parseInt(id));
  if (prod) {
    return res.status(200).json(prod);
  }
  res.status(404).json({
    error: "Producto no encontrado."
  });
});

export default router;