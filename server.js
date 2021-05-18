import path from "path";
import express from "express";
import fetch from "node-fetch";
import handlebars from "express-handlebars";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import prodRoutes from "./routes/ProductRoutes.js";
import carritoRoutes from "./routes/CarritoRoutes.js";
import frontRoutes from "./routes/FrontRoutes.js";

global.admin = true;
global.url = "http://localhost:8080";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PORT = process.env.PORT || 8080;
const app = express();

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use('/', frontRoutes);
app.use('/api/productos', prodRoutes);
app.use('/api/carrito', carritoRoutes);

app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
    defaultLayout: "layout.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

app.set("views", "./views");
app.set("view engine", "hbs");

// Middleware para mostrar error si la ruta no existe
app.use(function(req, res, next) {
	res.status(404)
	res.json({error : -2, descripcion: `Ruta '${req.url}' no implementada`});
});

// Funcion que devuelve los productos y emite el llamado a "listProducts"
const getProducts = () => {
	fetch(`${global.url}/api/productos`)
	.then((res) => res.json())
	.then((data) => {
		const prods = { products: data }
		io.sockets.emit("listProducts", { productos: prods, admin: admin });
	});	
}

// Funcion que devuelve los productos y emite el llamado a "listCarrito"
const getCarrito = () => {
	fetch(`${global.url}/api/carrito`)
	.then((res) => res.json())
	.then((data) => {
		io.sockets.emit("listCarrito", { carrito: data, admin: admin });
	});
}

io.on("connection", (socket) => {
	console.log("Nuevo cliente conectado!");
	const url = socket.handshake.headers.referer.split("/").pop();
	switch (url) {
		case "productos":
			(async ()=>{
				const initialProducts = getProducts();
				io.sockets.emit("listProducts", { productos: initialProducts, admin: admin });
			})()
			break;
		case "carrito":
			(async ()=>{
				const initialCarrito = getCarrito();
				io.sockets.emit("listCarrito", { carrito: initialCarrito, admin: admin });
			})()
			break;
	}
	
	/* Escucho los mensajes enviado por el cliente y se los propago a todos */
	socket.on("postProduct", () => {
		getProducts();
	}).on("removeProduct", () => {
		getProducts();
	}).on("removeCarritoProduct", () => {
		getCarrito();
	}).on('disconnect', () => {
		console.log('Usuario desconectado')
	});
});

// Conexion a server con callback avisando de conexion exitosa
const server = httpServer.listen(PORT, () => { console.log(`Ya me conecte al puerto ${PORT}.`) });
server.on('error', (error) => console.log(`Hubo un error inicializando el servidor: ${error}`));