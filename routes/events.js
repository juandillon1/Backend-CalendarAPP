

const express = require('express');
const router = express.Router();
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
// Custom middleware validation
const { isDate } = require('../helpers/isDate');

// Todas utilizan el validar token JWT
router.use(validarJWT);
// Obtener Eventos
router.get('/', getEventos);
// Crear Evento
router.post('/',
[
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'Fecha de finalización es obligatoria').custom( isDate ),
    validarCampos
],
crearEvento);
// Actualizar Evento
router.put('/:id',
[
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'Fecha de finalización es obligatoria').custom( isDate ),
    validarCampos
],
actualizarEvento);
// Borrar Evento
router.delete('/:id', eliminarEvento);

module.exports = router;