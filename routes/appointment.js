// Importar el módulo expres mediante un enrutador Router
const { Router } = require('express')
const router = Router()

// Importar el módulo joi
const Joi = require('joi')

// Exportar los métodos del servidor express (GET, GET/:i, POST, PUT, DELETE)
module.exports = router

const appointments = require('../Data/appointment.json')

router.get('/', (req, resp) => {
    console.log(req.url)
    // Envía el array courses
    resp.send(appointments)
})

