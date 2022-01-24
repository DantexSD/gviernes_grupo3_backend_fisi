const express = require("express");
const router = express.Router();
//const moment = require("moment");
const db = require('../database');
const as = require("../as");

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
// Validar Login
router.get("/users", async (req, res) => {
    await db.query('SELECT * FROM CATDFISI.usuarios', (err, rows, fields) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
})

router.post("/users/create", async (req, res) => {

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
    await db.query('SELECT CONCAT (d.apellidos, " ", d.nombres) as docente, avg(c.resultado_as) as resultado, round(avg(c.dificultad), 1) as dificultad FROM CATDFISI.docentes d LEFT JOIN CATDFISI.calificaciones c ON d.id_docente = c.id_docente GROUP BY d.nombres ORDER BY d.apellidos', (err, rows, fields) => {
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

    const { id_docente, usuario, curso, dificultad, dominio_curso, material_didactico, id_etiqueta, comentario, numero_like } = req.body;

    // const { etiqueta1, etiqueta2, etiqueta3 } = req.body;

    const resultado_as = await as.analisisSentimiento(comentario);

    let variable;

    const sql = "select MAX(id_etiqueta) + 1 as id_calificacion from CATDFISI.etiquetas;INSERT INTO CATDFISI.etiquetas set ?;INSERT INTO CATDFISI.calificaciones set ?";
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
        etiqueta1,
        etiqueta2,
        etiqueta3
    };

    // const id_etiqueta = id_valor(data[0])

    const newData = {
        id_docente,
        usuario,
        curso,
        fecha_calificacion,
        dificultad,
        dominio_curso,
        material_didactico,
        id_etiqueta,
        comentario,
        numero_like,
        resultado_as
    };

    await db.query(sql, [newEtiquetas, newData], (err, data, fields) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
            id_valor(data[0]);
            console.log(data[1]);
        }
    }) 

    // await db.query('INSERT INTO CATDFISI.calificaciones set ?', [newData], (err, data, field) => {
    //     if(err) {
    //         res.status(500).send(err);
    //     } else {
    //         res.status(201).send(data);
    //     }
    // });

    function id_valor(value) {
        variable = value;
        console.log(variable[0].id_calificacion);
    }

    // const newEtiquetas = {
    //     etiqueta1,
    //     etiqueta2,
    //     etiqueta3
    // };

    // await db.query('INSERT INTO CATDFISI.etiquetas set ?', [newEtiquetas], (err, data, fields) => {
    //     if(err) {
    //         res.status(500).send(err);
    //         console.log("perro")
    //     } else {
    //         res.status(201).send(data);
    //     }
    // }) 
    
})

module.exports = router;