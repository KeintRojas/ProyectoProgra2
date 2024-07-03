// Importar el módulo expres mediante un enrutador Router
const { Router } = require('express')
const router = Router()

// Importar el módulo joi
const Joi = require('joi')

// Exportar los métodos del servidor express (GET, GET/:i, POST, PUT, DELETE)
module.exports = router

const doctors = require('../Data/doctors.json')
const utilities = require('./utilities')
const { error } = require('console')

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

router.post('/',(req, resp) => {

    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        specialty: Joi.string().min(1).required()
    })

    const {error} = schema.validate(req.body)
    console.log(error)

    if(error) return resp.status(400).send(error.details[0].message)
    const doctor = {
        employeeId: utilities.increase(doctors.doctors.length),
        name: req.body.name,
        specialty: req.body.specialty
    }   

    doctors.doctors.push(doctor)
    utilities.jsonWriterFile('./Data/doctors2.json',doctors)
    resp.send(doctor)
}) 

function validateDoctor(doctor){
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        specialty: Joi.string().min(1).required()
    })
    return schema.validate(course)
}