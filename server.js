import express from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { registerUser } from "./userController.js";
import { verifyToken } from "./authMiddleware.js";
const cors = require("cors");
const app = express();
const port = 3000;

const { registerUser } = require("./userController");
import jwt from "jsonwebtoken";

app.use(cors());
app.use(express.json());

// Datos de ejemplo
// Define un secreto para JWT (cambia esto por un valor seguro)
const jwtSecret = "seguro";

const users = [];

// Ruta POST para crear un nuevo usuario
app.post("/users", (req, res, next) => {
  const { body = {} } = req;
  const user = {
    id: uuidv4(),
    lastname: body.lastname,
    password: body.password,
  };
  users.push(user);
  res.status(201).json(user);
});

// Ruta de Autenticación de Usuario
app.post("/login", async (req, res) => {
  const { body = {} } = req;
  const { lastname, password } = body;

  try {
    // Verifica las credenciales del usuario
    const user = users.find(
      (u) => u.lastname === lastname && u.password === password
    );

    if (user) {
      // Genera un token JWT
      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: "1h",
      });

      res.json({ token });
    } else {
      res.status(401).json({ message: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error("Error en la autenticación:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta protegida con autenticación
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Ruta protegida exitosamente" });
});

// Ruta GET para obtener todos los usuarios
app.get("/users", (req, res, next) => {
  res.json(users);
});

// Ruta GET para obtener un usuario por su ID
app.get("/users/:id", (req, res, next) => {
  const { params = {} } = req;
  const { id = "" } = params;

  const user = users.find(function (element) {
    return id === element.id;
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "Usuario no encontrado" });
  }
});

// Ruta PUT para actualizar un usuario por su ID
app.put("/users/:id", (req, res, next) => {
  const { params = {}, body = {} } = req;
  const { id = "" } = params;

  const index = users.findIndex(function (element) {
    return id === element.id;
  });

  if (index !== -1) {
    const user = {
      ...users[index],
      ...body,
    };
    users[index] = user;
    res.json(user);
  } else {
    res.status(404).json({ message: "Usuario no encontrado" });
  }
});

// Ruta DELETE para eliminar un usuario por su ID
app.delete("/users/:id", (req, res, next) => {
  const { params = {} } = req;
  const { id = "" } = params;

  const index = users.findIndex(function (element) {
    return id === element.id;
  });

  if (index !== -1) {
    users.splice(index, 1);
    res.status(204).end(); // Enviar una respuesta sin contenido (204 No Content)
  } else {
    res.status(404).json({ message: "Usuario no encontrado" });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
