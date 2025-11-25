const express = require("express");
const filesController = require("../controllers/files.controller");

const router = express.Router();

// GET /files/list - Lista de archivos disponibles
router.get("/list", filesController.getFilesList);

// GET /files/data - Datos procesados de los archivos
router.get("/data", filesController.getFilesData);

module.exports = router;
