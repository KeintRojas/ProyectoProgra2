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
    const appointment = appointments.appointment.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.hour}`)
        const dateB = new Date(`${b.date}T${b.hour}`)
        return dateA - dateB
    })
    resp.send(appointment)
})

router.get('/patients/:id', (req, resp) => {
    console.log(req.url)

    const patient = patients.patients.find(p => p.id === parseInt(req.params.id))
    console.log(patient)
    if (!patient) return resp.status(404).send(`El paciente con el id ${req.params.id} no existe`)
    let appointment = appointments.appointment.filter(a => a.patient === parseInt(req.params.id))
    console.log(appointment)
    if (appointment.length === 0) return resp.status(404).send(`El paciente con el id ${req.params.id} no tiene citas programadas`)

    appointment = appointment.map(appointment => {
        const doctor = doctors.doctors.find(d => d.employeeId === appointment.employeeId);
        return {
            ...appointment,
            doctorName: doctor.name,
            doctorSpecialty: doctor.specialty
        };
    });

    appointment.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.hour}`)
        const dateB = new Date(`${b.date}T${b.hour}`)
        return dateA - dateB
    })

    resp.send(appointment)
})

router.get('/doctor/:id', (req, resp) => {
    console.log(req.url)

    const doctor = doctors.doctors.find(d => d.employeeId === parseInt(req.params.id))
    console.log(doctor)
    if (!doctor) return resp.status(404).send(`El doctor con el id ${req.params.id} no existe`)

    let appointment = appointments.appointment.filter(a => a.employeeId === parseInt(req.params.id))
    console.log(appointment)
    if (appointment.length === 0) return resp.status(404).send(`El doctor con el id ${req.params.id} no tiene citas programadas`)

    appointment = appointment.map(appointment => {
        const patient = patients.patients.find(p =>  p.id === appointment.patient);
        return {
            ...appointment,
            patientName: patient.name,
            patientCellphone: patient.phone
        };
    });

    appointment.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.hour}`)
        const dateB = new Date(`${b.date}T${b.hour}`)
        return dateA - dateB
    })
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
    
    const schema = Joi.object({
        employeeId: Joi.required(),
        patient: Joi.required(),
        date: Joi.string().min(10).required(),
        hour: Joi.string().min(5).required()
    })

    const {error} = schema.validate(req.body)
    console.log(error)
    if(error) return resp.status(400).send(error.details[0].message)

    const appointmentDate = new Date(`${req.body.date}T${req.body.hour}`);
    const now = new Date();
    if (appointmentDate <= now) return resp.status(400).send('La fecha y hora deben ser posteriores a la actual');
    
    const existAppointment = appointments.appointment.find(a => 
        a.employeeId === req.body.employeeId && 
        a.date === req.body.date && 
        a.hour === req.body.hour &&
        a.state === "active"
    )
    console.log(existAppointment)
    if (existAppointment) return resp.status(400).send('La cita ya está ocupada por otro paciente');

    const appointment = {
        employeeId: req.body.employeeId,
        date: req.body.date,
        patient: req.body.patient,
        hour: req.body.hour,
        state: "active"
    }

    appointments.appointment.push(appointment)
    utilities.jsonWriterFile('./Data/appointment.json', appointments)
    resp.send(appointment)
})

router.delete('/', (req, resp) => {
    console.log(req.url)
    const schema = Joi.object({
        employeeId: Joi.required(),
        patient: Joi.required(),
        date: Joi.string().min(10).required(),
        hour: Joi.string().min(5).required()
    })

    const {error} = schema.validate(req.body)
    console.log(error)
    if(error) return resp.status(400).send(error.details[0].message)

    const existAppointment = appointments.appointment.find(a => 
        a.employeeId === req.body.employeeId && 
        a.date === req.body.date && 
        a.hour === req.body.hour &&
        a.state === "active"
    )
    console.log(existAppointment)
    if (!existAppointment) return resp.status(400).send('No se existe la cita a cancelar o anteriormente fue cancelada');
    
    existAppointment.state = "canceled"
    utilities.jsonWriterFile('./Data/appointment.json', appointments)
    resp.send(existAppointment)
})