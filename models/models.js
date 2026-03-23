import { rejects } from "assert";
import { promises } from "fs";
import mysql from "mysql2";
import { resolve } from "path";
import dotenv from 'dotenv';
dotenv.config();

// configurar la conexion
var conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// abrir la conexion
conexion.connect((err)=>{

    if(err){
        console.log("Surgio un error " + err);
    }
    else {
        console.log("Se realizo la conexion");
    }

});

var alumnosDB={}

// funcion para insertar
alumnosDB.insertar = function insertar(alumno){
    return new Promise((resolve, reject)=>{
        let sqlConsulta = "INSERT INTO alumnos set ?"
        conexion.query(sqlConsulta, alumno, (err, res)=>{

            if(err){
                console.log("surgio un error insertando" + err)
                reject(err)
            }
            else {
                resolve(res.insertId);
            }
        })
    });
};

alumnosDB.mostrarTodos = function mostrarTodos(){
    return new Promise((resolve, reject)=>{
        let sqlConsulta = "SELECT * FROM alumnos ";
        conexion.query(sqlConsulta, (err, resultado)=>{

            if(err) {
                console.log("surgio un error" + err)
                reject(err);
            } else {
                console.log(" Listado de alumnos obtenidos");
                resolve(resultado);
            }
        })

    })

}

const alumno ={
    matricula:2024030374,
    nombre: "Fernando Cristerna",
    domicilio: "Coto 8 5025",
    fechanac: "2006-03-17",
    sexo : "M",
    status:0
}

// llamar a la funciones async/await


// Buscar por id
alumnosDB.buscarPorId = function buscarPorId(id) {
    return new Promise((resolve, reject) => {
        let sqlConsulta = "SELECT * FROM alumnos WHERE id = ?";
        conexion.query(sqlConsulta, [id], (err, resultado) => {
            if (err) {
                console.log("Error al buscar por id : " + err);
                reject(err);
            } else {
                resolve(resultado);
            }
        });
    });
};

// Buscar por matrícula
alumnosDB.buscarPorMatricula = function buscarPorMatricula(matricula) {
    return new Promise((resolve, reject) => {
        let sqlConsulta = "SELECT * FROM alumnos WHERE matricula = ?";
        conexion.query(sqlConsulta, [matricula], (err, resultado) => {
            if (err) {
                console.log("Error al buscar por matrícula: " + err);
                reject(err);
            } else {
                resolve(resultado);
            }
        });
    });
};


// borrar por ID
alumnosDB.borrarPorId = function borrarPorId(id) {
    return new Promise((resolve, reject) => {
        let sqlConsulta = "DELETE FROM alumnos WHERE id = ?";
        conexion.query(sqlConsulta, [id], (err, resultado) => {
            if (err) {
                console.log(" Error al borrar alumno: " + err);
                reject(err);
            } else {
                resolve(" Alumno eliminado correctamente");
            }
        });
    });
};

// Actualizar un registro completo por ID
alumnosDB.actualizarPorId = function actualizarPorId(id, nuevoAlumno) {
    return new Promise((resolve, reject) => {
        let sqlConsulta = "UPDATE alumnos SET ? WHERE id = ?";
        conexion.query(sqlConsulta, [nuevoAlumno, id], (err, resultado) => {
            if (err) {
                console.log(" Error al actualizar alumno: " + err);
                reject(err);
            } else {
                resolve(" Alumno actualizado correctamente");
            }
        });
    });
};

// Actualizar estado (cambiar de 0 a 1 o de 1 a 0)
alumnosDB.cambiarStatus = function cambiarStatus(id) {
    return new Promise((resolve, reject) => {
        let sqlConsulta = "UPDATE alumnos SET status = NOT status WHERE id = ?";
        conexion.query(sqlConsulta, [id], (err, resultado) => {
            if (err) {
                console.log(" Error al cambiar estado: " + err);
                reject(err);
            } else {
                resolve("Estado actualizado correctamente");
            }
        });
    });
};

// llamar a la funciones async/await

async function test() {
    try {
        console.log("🔄 Insertando alumno...");
        let id = await alumnosDB.insertar(alumno);
        console.log(" Se insertó con Id: " + id);

        console.log(" Obteniendo lista de alumnos...");
        let alumnos = await alumnosDB.mostrarTodos();
        console.log("Lista de alumnos:", alumnos);

        console.log(" Actualiz alumnos...");
        alumno.nombre ="Maria Carbajo";
        alumno.domicilio= "Av del sol 33";
        alumno.sexo="F";
        await alumnosDB.actualizarPorId(id,alumno)
        // consultar por id
        let objAlumno = await alumnosDB.buscarPorMatricula(alumno.matricula)
        console.log("Alumno consultado:", objAlumno);
        console.log("Cambiar de estatus al alumno id =" +id)
        await alumnosDB.cambiarStatus(id)
        console.log("Mostrar alumno con cambio de estatus");

        let obj = await alumnosDB.buscarPorId(id);
        console.log("Alumno consultado:", obj);

    } catch (error) {
        console.error(" Error en test(): " + error);
    }
}

test();
export default alumnosDB;
