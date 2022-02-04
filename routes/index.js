const express = require("express");
const router = express.Router();
//const moment = require("moment");
const db = require('../database');
const as = require("../as");

// API ROUTES

// GET

router.get("/", (req, res, next) => {
    res.status(200).send("T029 - Despliegue del backend en Heroku")
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

// Validar Login
router.post("/users/login", async (req, res) => {
    const { correo, contrasena } = req.body;
    await db.query('SELECT * FROM CATDFISI.usuarios WHERE correo = ? AND contrasena = ?', [correo, contrasena], (err, rows, fields) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.send(rows)
        }
    })
})

router.post("/users/signup", async (req, res) => {

    const { usuario, correo, contrasena, admin } = req.body;

    const newData = {
        usuario,
        correo,
        contrasena,
        admin
    };

    await db.query('INSERT INTO CATDFISI.usuarios set ?', [newData], (err, data, field) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
});

// API calificaciones

// Capturado en Visualizar ranking final docentes
router.get("/ranking", async (req, res) => {
    await db.query('SELECT d.id_docente as id_docente, CONCAT (d.apellidos, " ", d.nombres) as docente, IFNULL(avg(c.resultado_as), 10) as resultado, IFNULL(round(avg(c.dificultad), 1), 10) as dificultad FROM CATDFISI.docentes d LEFT JOIN CATDFISI.calificaciones c ON d.id_docente = c.id_docente GROUP BY d.nombres ORDER BY d.apellidos', (err, rows, fields) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
    })
})

router.get("/calificaciones", async (req, res) => {
    await db.query('SELECT * FROM CATDFISI.calificaciones', (err, rows, fields) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
    }) 
})

// Capturado en Screen Calificacion docente.
router.get("/calificaciones/:id_docente", async (req, res) => {
    const id_docente = req.params.id_docente;
    console.log(id_docente);
    if(id_docente != null) {
        await db.query('SELECT c.id_calificacion, c.id_docente, c.usuario, c.fecha_calificacion, c.curso, c.dificultad, e.etiqueta1, e.etiqueta2, e.etiqueta3, c.comentario, c.numero_like, c.resultado_as from CATDFISI.calificaciones c LEFT JOIN CATDFISI.etiquetas e ON e.id_etiqueta = c.id_etiqueta WHERE c.id_docente = ?', [id_docente], (err, rows, fields) => {
            // console.log(rows.length)
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

// Send in Registrar Calificacion
router.post("/calificaciones/create/", async(req, res) => {

    const { id_docente, usuario, id_etiqueta, fecha_calificacion, curso, dificultad, dominio_curso, material_didactico, comentario, numero_like, etiqueta1, etiqueta2, etiqueta3 } = req.body;

    // const { etiqueta1, etiqueta2, etiqueta3 } = req.body;

    const resultado_as = await as.analisisSentimiento(comentario);

    // let variable;
    // let id_etiqueta;

    const sql = "INSERT INTO CATDFISI.etiquetas set ?;INSERT INTO CATDFISI.calificaciones set ?";
    // 
    // 
    // await db.query('select MAX(id_etiqueta) + 1 as id_calificacion from CATDFISI.etiquetas', (err, data, fields) => {
    //     if(err) {
    //         res.status(500).send(err);
    //     } else {
    //         id_valor(data);
    //     }
    // }) 

    const newEtiquetas = {
        id_etiqueta,
        etiqueta1,
        etiqueta2,
        etiqueta3
    };

    // const id_etiqueta = id_valor(data[0])


    const newData = {
        id_docente,
        usuario,
        fecha_calificacion,
        curso,
        dificultad,
        dominio_curso,
        material_didactico,
        id_etiqueta,
        comentario,
        numero_like ,
        resultado_as
    };

    await db.query(sql, [newEtiquetas, newData], (err, data, fields) => {
        
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
            // id_etiqueta = id_valor(data[0]);
            console.log(data[1]);
            console.log(data[2]);
        }
    }) 
 
})

module.exports = router;