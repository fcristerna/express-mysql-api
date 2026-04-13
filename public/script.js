const API = '';

const pError = document.getElementById('alerta');

const formAgregar = document.getElementById('formAgregar');
const agMatricula = document.getElementById('agMatricula');
const agNombre = document.getElementById('agNombre');
const agDomicilio = document.getElementById('agDomicilio');
const agFechanac = document.getElementById('agFechanac');
const agSexo = document.getElementById('agSexo');

const btnListar = document.getElementById('btnListar');
const resultListar = document.getElementById('resultListar');

const buscarId = document.getElementById('buscarId');
const btnBuscarId = document.getElementById('btnBuscarId');
const resultBuscarId = document.getElementById('resultBuscarId');

const buscarMat = document.getElementById('buscarMat');
const btnBuscarMat = document.getElementById('btnBuscarMat');
const resultBuscarMat = document.getElementById('resultBuscarMat');

const formActualizar = document.getElementById('formActualizar');
const actId = document.getElementById('actId');
const actMatricula = document.getElementById('actMatricula');
const actNombre = document.getElementById('actNombre');
const actDomicilio = document.getElementById('actDomicilio');
const actFechanac = document.getElementById('actFechanac');
const actSexo = document.getElementById('actSexo');

const borrarId = document.getElementById('borrarId');
const btnBorrar = document.getElementById('btnBorrar');
const resultBorrar = document.getElementById('resultBorrar');

function mostrarError(mensaje, tiempo) {
    pError.className = 'alert alert-danger';
    pError.textContent = mensaje;
    pError.classList.remove('d-none');
    setTimeout(() => {
        pError.classList.add('d-none');
    }, tiempo);
}

function mostrarExito(mensaje) {
    pError.className = 'alert alert-success';
    pError.textContent = mensaje;
    pError.classList.remove('d-none');
    setTimeout(() => {
        pError.classList.add('d-none');
    }, 4000);
}


function crearFilaAlumno(a) {
    const fila = document.createElement('tr');

    const cid = document.createElement('td');
    cid.textContent = a.id;
    fila.appendChild(cid);

    const cmat = document.createElement('td');
    cmat.textContent = a.matricula;
    fila.appendChild(cmat);

    const cnom = document.createElement('td');
    cnom.textContent = a.nombre;
    fila.appendChild(cnom);

    const cdom = document.createElement('td');
    cdom.textContent = a.domicilio || '';
    fila.appendChild(cdom);

    const csex = document.createElement('td');
    csex.textContent = a.sexo;
    fila.appendChild(csex);

    const csta = document.createElement('td');
    csta.textContent = a.status;
    fila.appendChild(csta);

    return fila;
}

function construirTabla(lista, contenedor) {
    contenedor.innerHTML = '';

    if (!lista.length) {
        const p = document.createElement('p');
        p.className = 'text-muted';
        p.textContent = 'Sin resultados';
        contenedor.appendChild(p);
        return;
    }

    const tabla = document.createElement('table');
    tabla.className = 'table table-sm table-bordered table-hover';

    const thead = document.createElement('thead');
    thead.className = 'table-dark';
    thead.innerHTML = '<tr><th>ID</th><th>Matricula</th><th>Nombre</th><th>Domicilio</th><th>Sexo</th><th>Status</th></tr>';
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    lista.forEach(a => {
        tbody.appendChild(crearFilaAlumno(a));
    });
    tabla.appendChild(tbody);

    contenedor.appendChild(tabla);
}

function mostrarUnAlumno(a, contenedor) {
    contenedor.innerHTML = '';
    const tabla = document.createElement('table');
    tabla.className = 'table table-sm table-bordered table-hover';

    const thead = document.createElement('thead');
    thead.className = 'table-dark';
    thead.innerHTML = '<tr><th>ID</th><th>Matricula</th><th>Nombre</th><th>Domicilio</th><th>Sexo</th><th>Status</th></tr>';
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.appendChild(crearFilaAlumno(a));
    tabla.appendChild(tbody);

    contenedor.appendChild(tabla);
}

async function peticion(url, opciones) {
    try {
        const response = await fetch(url, opciones);
        const data = await response.json();
        return { ok: response.ok, data };
    } catch (error) {
        mostrarError('Error de conexion', 4000);
        return null;
    }
}

formAgregar.addEventListener('submit', async function (e) {
    e.preventDefault();
    const body = {
        matricula: agMatricula.value,
        nombre: agNombre.value,
        domicilio: agDomicilio.value,
        fechanac: agFechanac.value,
        sexo: agSexo.value,
        status: 0
    };
    const resultado = await peticion(API + '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!resultado) return;
    if (resultado.ok) {
        mostrarExito('Alumno agregado con ID ' + resultado.data.id);
        formAgregar.reset();
    } else {
        mostrarError(resultado.data.error, 4000);
    }
});

btnListar.addEventListener('click', async function () {
    const resultado = await peticion(API + '/todos');
    if (!resultado) return;
    if (resultado.ok) {
        construirTabla(resultado.data, resultListar);
    } else {
        mostrarError(resultado.data.error, 4000);
    }
});

btnBuscarId.addEventListener('click', async function () {
    const id = buscarId.value;
    const resultado = await peticion(API + '/' + id);
    if (!resultado) return;
    if (resultado.ok) {
        mostrarUnAlumno(resultado.data, resultBuscarId);
    } else {
        resultBuscarId.innerHTML = '';
        mostrarError(resultado.data.error, 4000);
    }
});

btnBuscarMat.addEventListener('click', async function () {
    const mat = buscarMat.value;
    const resultado = await peticion(API + '/matricula/' + mat);
    if (!resultado) return;
    if (resultado.ok) {
        mostrarUnAlumno(resultado.data, resultBuscarMat);
    } else {
        resultBuscarMat.innerHTML = '';
        mostrarError(resultado.data.error, 4000);
    }
});

formActualizar.addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = actId.value;
    const body = {};
    if (actMatricula.value) body.matricula = actMatricula.value;
    if (actNombre.value) body.nombre = actNombre.value;
    if (actDomicilio.value) body.domicilio = actDomicilio.value;
    if (actFechanac.value) body.fechanac = actFechanac.value;
    if (actSexo.value) body.sexo = actSexo.value;
    const resultado = await peticion(API + '/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!resultado) return;
    if (resultado.ok) {
        mostrarExito(resultado.data.mensaje);
        formActualizar.reset();
    } else {
        mostrarError(resultado.data.error, 4000);
    }
});

btnBorrar.addEventListener('click', async function () {
    const id = borrarId.value;
    if (!confirm('Eliminar alumno con ID ' + id + '?')) return;
    const resultado = await peticion(API + '/' + id, { method: 'DELETE' });
    if (!resultado) return;
    resultBorrar.innerHTML = '';
    const p = document.createElement('p');
    if (resultado.ok) {
        p.className = 'text-success';
        p.textContent = resultado.data.mensaje;
    } else {
        p.className = 'text-danger';
        p.textContent = resultado.data.error;
    }
    resultBorrar.appendChild(p);
});
