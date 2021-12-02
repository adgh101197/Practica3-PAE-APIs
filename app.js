const express = require('express');
const app = express();
const path = require('path');

//Modelos
const Sala = require('./src/models/sala');
const Usuario = require('./src/models/usuario');
const Mensaje = require('./src/models/mensaje');

//Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

require('dotenv').config();


//Puerto
const port = process.env.PORT || 3000;

//Swagger
const swaggerOptions = {
    swaggerDefinition: {
        swagger: "2.0",
        info: {
            title: "Documentacion de APIs",
            description: "Práctica 3 de ",
            version: "1.0.0",
            servers: ['http://localhost:' + port],
            contact: {
                name: "Denisse Galindo",
                correo: "is708411@iteso.mx"
            }
        }
    },
    apis: ['app.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use('/assets', express.static(path.join(__dirname, 'public')));

//Base de datos con Mongoose
const mongoose = require('mongoose');
const uri = "mongodb+srv://" +process.env.DB +"?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("Database: Conexión exitosa a MongoDB"))
    .catch((err) => console.log(err));


app.listen(port, () => {
    console.log('Port: http://localhost:' + port);
    console.log('Swagger: http://localhost:'+ port +'/swagger-ui/#/')
});

////////////////////////////////////////ENDPOINTS//////////////////////////////

/** 
 * @swagger
 * /usuario/:email:
 *  get:
 *    description: Obtener un usuario específico
 *    parameters:
 *      - in: body
 *        name: params
 *        description: contraseña del usuario esperado
 *        type: object
 *        properties:
 *          password:
 *            type: string
 *    responses:
 *      200:
 *        description: respuesta exitosa
 *      400:
 *        description: hay un problema con la petición
*/
app.get('/usuario/:email', (req, res) => {
    Usuario.findOne({ "email": req.params.email })
        .then((result) => {
            if (result.password === req.body.password) {
                res.send(result)
            } else {
                res.send("Error")
            }
        })
        .catch((err) => console.log(err));
});


/** 
 * @swagger
 * /usuario:
 *  post:
 *    description: crear a un usuario
 *    parameters:
 *      - in: path
 *        name: email
 *        description: email del usuario
 *        type: string
 *      - in: body
 *        name: params
 *        description: email y contraseña
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          password:
 *            type: string
 *    responses:
 *      200:
 *        description: respuesta exitosa
 *      400:
 *        description: hay un problema con la petición
*/
app.post('/usuario', (req, res) => {
    const usuario = new Usuario({
        email: req.body.email,
        password: req.body.password
    });

    usuario.save()
        .then((result => {
            res.send(result);
        })
        )
        .catch((err) => console.log(err))
})


/** 
 * @swagger
 * /sala:
 *  post:
 *    description: crear una nueva sala
 *    parameters:
 *      - in: body
 *        name: params
 *        description: nombre de la sala
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *    responses:
 *      200:
 *        description: respuesta exitosa
 *      400:
 *        description: hay un problema con la petición
*/
app.post('/sala', (req, res) => {
    Sala.find()
    const sala = new Sala({
        name: req.body.name
    });
    sala.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => console.log(err))
});

/** 
 * @swagger
 * /sala/:id/link:
 *  get:
 *    description: obtener el link para unirse a la sala
 *    parameters:
 *      - in: params
 *        name: id 
 *        description: id de la sala a obtener
 *        type: string
 *    responses:
 *      200:
 *        description: respuesta exitosa
 *      400:
 *        description: hay un problema con la petición
*/
app.get('/sala/:id/link', (req, res) => {
    Sala.findOne({ "_id": req.params.id })
    .then((result) => {
        let nombre = result.name;
        let link = "http://127.0.0.1:/"+ nombre +"/" + req.params.id;
        Sala.findByIdAndUpdate(req.params.id, { url: link }, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(link);
            }
        })
    })
    .catch((err) => console.log(err));

    
});

/** 
 * @swagger
 * /sala/:id/mensajes:
 *  get:
 *    description: obtener los mensajes de una sala
 *    parameters:
 *      - in: params
 *        name: id 
 *        description: id de la sala a obtener
 *        type: string
 *    responses:
 *      200:
 *        description: respuesta exitosa
 *      400:
 *        description: hay un problema con la petición
*/
app.get('/sala/:id/mensajes', (req, res) => {
    Mensaje.find({ "sala_id": req.params.id })
        .then((result) => {
            res.send(result)
        })
        .catch((err) => console.log(err))
});


/** 
 * @swagger
 * /sala/:id/mensajes:
 *  post:
 *    description: agregar los mensajes
 *    parameters:
 *      - in: params
 *        name: id 
 *        description: id de la sala
 *        type: string
 *      - in: body
 *        name: params
 *        description: contenido del mensaje
 *        type: object
 *        properties:
 *          content:
 *            type: string
 *    responses:
 *      200:
 *        description: respuesta exitosa
 *      400:
 *        description: hay un problema con la petición
*/
app.post('/sala/:id/mensajes', (req, res) => {
    Mensaje.find()
    const mensaje = new Mensaje({
        sala_id: req.params.id,
        content: req.body.content
    });
    mensaje.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => console.log(err))
});