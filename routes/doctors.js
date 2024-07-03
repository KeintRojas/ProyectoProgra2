// Importar el módulo expres mediante un enrutador Router
const { Router } = require('express')
const router = Router()

// Importar el módulo joi
const Joi = require('joi')

// Exportar los métodos del servidor express (GET, GET/:i, POST, PUT, DELETE)
module.exports = router

const doctors = require('../Data/doctors.json')
const appointments = require('../Data/appointment.json')
const utilities = require('./utilities')
const { error } = require('console')
const { CANCELLED } = require('dns')

router.get('/', (req, resp) => {
    console.log(req.url)
    // Envía el array courses
    resp.send(doctors)
})

router.get('/:id', (req, resp) => {
    console.log(req.url)
    const doctor = doctors.doctors.find(d => d.employeeId === parseInt(req.params.id))
    console.log(doctor)
    if (!doctor) return resp.status(404).send(`El doctor con el id ${req.params.id} no existe`)
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
    utilities.jsonWriterFile('./Data/doctors.json',doctors)
    resp.send(doctor)
}) 

router.delete('/:id', (req, resp) => {
    console.log(req.url)
    const doctor = doctors.doctors.find(d => d.employeeId === parseInt(req.params.id))
    console.log(doctor)
    if (!doctor) return resp.status(404).send(`El doctor con el id ${req.params.id} no existe`)

    const appointment = appointments.appointment.filter(a => a.employeeId === parseInt(req.params.id))
    console.log(appointment)
    if (appointment.length === 0) return resp.status(404).send(`El doctor con el id ${req.params.id} no tiene citas programadas`)
    
    appointment.forEach(a => a.state = "canceled")
    
    utilities.jsonWriterFile('./Data/appointment.json', appointments)
    resp.send(`Se han cancelado todas las citas del doctor con el id ${req.params.id}`)
    
})