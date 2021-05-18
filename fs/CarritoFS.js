import { promises } from 'fs';
import carrito from "../controllers/CarritoController.js";

export const carritoLOG = 'public/log/carrito.txt';

export async function saveCarrito(carrito) {
  try {
		await promises.writeFile(carritoLOG, JSON.stringify(carrito, null, "\t"));
	} catch(err) {
		console.log(err);
	}
}

export async function loadCarrito() {
	try {
		const data = JSON.parse(await promises.readFile(carritoLOG, 'utf8'));
		return data;
	}
	catch(err) {
		console.log("Aun no hay productos en el carrito.")
	}
}