// Importar el módulo expres mediante un enrutador Router
const { Router } = require('express')
const router = Router()

// Importar el módulo joi
const Joi = require('joi')

// Exportar los métodos del servidor express (GET, GET/:i, POST, PUT, DELETE)
module.exports = router

const doctors = require('../Data/doctors.json')

router.get('/', (req, resp) => {
    console.log(req.url)
    // Envía el array courses
    resp.send(doctors)
})

router.get('/:id', (req, resp) => {
    console.log(req.url)
    const doctor = doctors.doctors.find(d => d.employeeId === parseInt(req.params.id))
    console.log(doctor)
    if (!doctor) return resp.status(404).send(`El curso con el id ${req.params.id} no existe`)
    // Envía el array courses
    resp.send(doctor)
})