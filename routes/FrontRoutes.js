import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/productos", (req, res) => {
  fetch(`${global.url}/api/productos`).then(res => res.json()).then((data) => {
    res.render("productos", { productos: data, admin: global.admin });
  });
});

router.get("/productos/actualizar/:id", (req, res) => {
  const { id } = req.params;
  fetch(`${global.url}/api/productos/${id}`).then(res => res.json()).then((data) => {
    res.render("actualizar", { producto: data });
  });
});

router.get("/carrito", (req, res) => {
  fetch(`${global.url}/api/carrito`).then(res => res.json()).then((data) => {
    res.render("carrito", { carrito: data, admin: global.admin });
  });
});

export default router;