// Importar el módulo expres mediante un enrutador Router
const { Router } = require('express')
const router = Router()

// Importar el módulo joi
const Joi = require('joi')

// Exportar los métodos del servidor express (GET, GET/:i, POST, PUT, DELETE)
module.exports = router

const patients = require('../Data/patients.json')

router.get('/', (req, resp) => {
    console.log(req.url)
    // Envía el array
    patient = patients.patients
    resp.send(patient)
})

router.get('/:id', (req, resp) => {
    console.log(req.url)
    const patient = patients.patients.find(p => p.id === parseInt(req.params.id))
    console.log(patient)
    if (!patient) return resp.status(404).send(`El paciente con el id ${req.params.id} no existe`)
    // Envía el paciente
    resp.send(patient)
})