const mysql = require('mysql2');
const { promisify } = require('util');

const { database } = require('./Keys');

const db = mysql.createPool(database); //Hilos que se van ejecutando para realizar una tarea

db.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED');
        }

        //Comprobar cuantas conexiones tiene la BD hasta el momento
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTION')
        }

        //Conexion rechazada
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED')
        }

    }

    //Establecemos la conexión
    if (connection) connection.release();
    console.log('DB IS CONNECTED!');
    return;
});

//Cada vez que hacemos una consulta, puedo hacer promesas
//Convertimos en promesas lo que antes era callbacks
db.query = promisify(db.query);

module.exports = db;