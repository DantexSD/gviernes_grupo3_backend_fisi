const express = require("express");
const router = express.Router();
//const moment = require("moment");
const db = require('../database');

// API ROUTES

// GET

router.get("/", (req, res, next) => {
    res.status(200).send("hello")
})

// API docentes

router.get("/docentes", async(req,res) => {
    await db.query('SELECT * FROM CATDFISI.docentes', (err, rows, fields) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
    })
});

router.get("/docentes/:id", async (req, res) => {
    const id_docente = req.params.id;
    console.log(id_docente);
    if(id_docente != null) {
        await db.query('SELECT * FROM CATDFISI.docentes WHERE id_docente = ?', [id_docente], (err, rows, fields) => {
            console.log(rows.length)
            if(err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(rows)
            }
        })
    } else {
        res.send(JSON.stringify({ success: false, message: "missing id in query"}))
    }
});

router.post("/docentes/create", async(req, res) => {
    const { nombres, apellidos, universidad, facultad } = req.body;
    const newLink = {
        nombres,
        apellidos,
        universidad,
        facultad
    };
    await db.query('INSERT INTO CATDFISI.docentes set ?', [newLink], (err, data, field) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
    
})

// API users
router.get("/users", (req, res) => {

})

// API calificaciones
router.get("/calificaciones", async (req, res) => {
    await db.query('SELECT * FROM CATDFISI.calificaciones', (err, rows, fields) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
    }) 
})

router.get("/calificaciones/:id", async (req, res) => {
    const id_calificacion = req.params.id;
    console.log(id_calificacion);
    if(id_calificacion != null) {
        await db.query('SELECT * FROM CATDFISI.calificaciones WHERE id_calificacion = ?', [id_calificacion], (err, rows, fields) => {
            console.log(rows.length)
            if(err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(rows)
            }
        })
    } else {
        res.send(JSON.stringify({ success: false, message: "missing id in query"}))
    }
});

router.post("/calificaciones/create", async(req, res) => {
    const { id_docente, usuario, curso, dificultad, dominio_curso, material_didactico, id_etiqueta, comentario, numero_like, resultado_as } = req.body;
    const newData = {
        id_docente,
        usuario,
        curso,
        dificultad,
        dominio_curso,
        material_didactico,
        id_etiqueta,
        comentario,
        numero_like,
        resultado_as
    };
    await db.query('INSERT INTO CATDFISI.docentes set ?', [newData], (err, data, field) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });

})

module.exports = router;