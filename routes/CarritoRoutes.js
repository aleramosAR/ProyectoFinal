import express from "express";
import carrito from "../controllers/CarritoController.js";

const router = express.Router();
router.use(express.json());

// Cargo el carrito completo
router.get("/", (req, res) => {
  (async ()=>{
    const carritoData = await carrito.getCarrito();
    if (!carritoData) {
      return res.status(404).json({
        error: "No hay productos en el carrito.",
      });
    }
    res.json(carritoData);
  })()
});

// Cargo el listado de productos, devuelvo un mensajes si el listado esta vacio (devuelve false)
router.get("/productos", (req, res) => {
  const productos = carrito.getCarritoProds();
  if (!productos) {
    return res.status(404).json({
      error: "No hay productos en el carrito.",
    });
  }
  res.json(productos);
});

// Devuelvo un determinado carrito
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const producto = carrito.getCarritoProd(id);
  if (producto) {
    return res.json(producto);
  }
  res.status(404).json({
    error: "Producto no encontrado en el carrito."
  });
});

// Agrego un producto al carrito
router.post("/agregar/:id", (req, res) => {
  const { id } = req.params;
  const newProduct = carrito.addCarritoProd(id);
  if (newProduct) {
    res.status(201).json(newProduct);
  }
  res.status(400).send();
});

// Elimino un producto
router.delete("/borrar/:id", (req, res) => {
  const { id } = req.params;

  // Elimino el producto segun el id que se paso y recibo la respuesta en una variable.
  // Si el producto que intente eliminar existe lo devuelvo con un status 200.
  // Si el producto que intente eliminar no existe devuelvo un error con un status 404.
  const prod = carrito.deleteCarritoProd(parseInt(id));
  if (prod) {
    return res.status(200).json(prod);
  }
  res.status(404).json({
    error: "Producto no encontrado en el carrito."
  });
});

export default router;