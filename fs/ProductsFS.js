import { promises } from 'fs';
import stock from "../controllers/ProductController.js";

export const productosLOG = './public/log/productos.txt';

export async function saveProducts(products, id) {
	const obj = {
		products: products,
		currentID: id
	};
  try {
		await promises.writeFile(productosLOG, JSON.stringify(obj, null, "\t"));
	} catch(err) {
		console.log(err);
	}
}

export async function loadProducts() {
	try {
		const data = JSON.parse(await promises.readFile(productosLOG, 'utf8'));
		return data;
	} catch(err) {
		console.log("Aun no hay productos cargados.");
	}
}