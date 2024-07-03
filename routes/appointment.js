// Importar el módulo expres mediante un enrutador Router
const { Router } = require('express')
const router = Router()

// Importar el módulo joi
const Joi = require('joi')

// Exportar los métodos del servidor express (GET, GET/:i, POST, PUT, DELETE)
module.exports = router

const appointments = require('../Data/appointment.json')
const doctors = require('../Data/doctors.json')
const patients = require('../Data/patients.json')
const utilities = require('./utilities')

router.get('/', (req, resp) => {
    console.log(req.url)
    // Envía el array courses
    resp.send(appointments)
})

router.get('/patients/:id', (req, resp) => {
    console.log(req.url)
    const appointment = appointments.appointment.filter(a => a.patient === parseInt(req.params.id))
    console.log(appointment)
    if (appointment.length === 0) return resp.status(404).send(`El paciente con el id ${req.params.id} no tiene citas programadas`)
    // Envía el array courses
    resp.send(appointment)
})

router.get('/doctor/:id', (req, resp) => {
    console.log(req.url)
    const appointment = appointments.appointment.filter(a => a.employeeId === parseInt(req.params.id))
    console.log(appointment)
    if (appointment.length === 0) return resp.status(404).send(`El doctor con el id ${req.params.id} no tiene citas programadas`)
    // Envía el array courses
    resp.send(appointment)
})

router.post('/', (req, resp) => {

    console.log(req.url)
    const doctor = doctors.doctors.find(d => d.employeeId === parseInt(req.body.employeeId))
    console.log(doctor)
    if (!doctor) return resp.status(404).send(`El doctor con el id ${req.body.employeeId} no existe`)
    const patient = patients.patients.find(p => p.id === parseInt(req.body.patient))
    console.log(patient)
    if (!patient) return resp.status(404).send(`El paciente con el id ${req.body.patient} no existe`)
    
    const appointment = {
        employeeId: utilities.increase(doctors.doctors.length),
        date: req.body.date,
        patient: req.body.date,
        hour: req.body.hour,
        state: "active"
    }

    appointments.appointment.push(appointment)
    utilities.jsonWriterFile('./Data/appointment2.json', appointments)
    resp.send(appointment)
})