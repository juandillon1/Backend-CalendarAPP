const {response} = require('express');
const { findById } = require('../models/Evento');
const Evento = require('../models/Evento');

const getEventos = async (req, res=response) => {
    const eventos = await Evento.find()
                                .populate('user', 'name');
    return res.status(200).json({
        ok: true,
        eventos
    });
};

const crearEvento = async (req, res=response) => {
    const evento = new Evento(req.body);
    try{
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        return res.status(201).json({
            ok: true,
            evento: eventoGuardado
        });
    } catch( error ) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};

const actualizarEvento = async (req, res=response) => {
    const eventoId = req.params.id;
    const uid = req.uid;
    try{
        const evento = await Evento.findById(eventoId);
        if(! evento ){
            return res.status(404).json({
                ok: false,
                msg: 'No hay un evento con esa Id'
            });
        }
        if( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar el evento'
            });
        }
        const nuevoEvento = {
            ...req.body,
            user: uid
        }
        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, {new: true, useFindAndModify: false} );
        return res.status(201).json({
            ok: true,
            evento: eventoActualizado
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};

const eliminarEvento = async (req, res=response) => {
    const eventoId = req.params.id;
    const uid = req.uid;
    try{
        const evento = await Evento.findById(eventoId);
        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'No hay un evento con esa Id'
            });
        }
        if(evento.user.toString() !== uid){
            return res.status(404).json({
                ok: false,
                msg: 'No tiene privilegios para borrar esta nota'
            });
        }
        const eventoBorrado = await Evento.findByIdAndDelete(eventoId, {useFindAndModify: false});
        return res.status(201).json({
            ok: true,
            evento: eventoBorrado
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
};