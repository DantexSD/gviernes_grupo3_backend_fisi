// const spawn = require('child_process').spawn;
const spawn = require("child_process").spawn;
const { once } = require("events")

// let comentario = "Sus tareas son sacadas de internet. No sabe que dejo y a la hora de revisar ni siquiera se si lo revisa, no puedes preguntar porque se enoja, si tienes una duda guardatela. No la recomiendo"
// let comentario = "Pesima enseñanza, no hay empatía y califica muy duro"
// let comentario = "Califica duro en cuanto a sus exámenes, ademas del proyecto en el cual tienes que invertir y tener tus ideas claras, para que no te agarre desprevenido y te baje puntos. Y sus lecturas que deja son larguísimas. TU FLORO debe ser creíble para los exámenes: así que solo queda estudiar"
///let comentario = "Muy relax, se aprueba izi . Todas tus notas dependen del proyecto, asi que no te descuides, aunque igual apruebes xd."

const analisisSentimiento = async (comentario) => {

    const pythonProcess = spawn('python', ['analisis_sentimientos.py',comentario])

    let respuesta;

    pythonProcess.stdout.on("data", (data) => {
        respuesta = data.toString()
    });

    pythonProcess.stderr.on("data", data => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('exit',(code) =>{
        console.log(respuesta);
        
    });

    await once(pythonProcess, 'close');

    return respuesta;

}
module.exports = { analisisSentimiento };
