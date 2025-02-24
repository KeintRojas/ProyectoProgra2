// Importar el módulo express
const express = require('express')

// Generar una app de express
const app = express()

// Importar módulo cors
const cors = require('cors')


// Se habilita la interpretación de json desde la app express
app.use(express.json())
app.use(cors())

// Definir propiedades
app.set('json spaces', 2) // Formato de JSON
app.set('port', process.env.port || 3000)

// Importar las rutas
app.use('/api/patients', require('./routes/patient'))
app.use('/api/doctors', require('./routes/doctors'))
app.use('/api/appointments', require('./routes/appointment'))

// Iniciar la aplicación
app.listen(app.get('port'), () => {
    console.log(`Listening on port ${app.get('port')}`)
})