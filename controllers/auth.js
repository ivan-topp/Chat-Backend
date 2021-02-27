const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
    try {
        const { email, password } = req.body;
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                ok: false,
                message: 'Ya se encuentra un usuario registrado con ese correo electrónico'
            });
        }
        const user = new User(req.body);
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        await user.save();
        const token = await generateJWT();
        return res.status(200).json({
            ok: true,
            user,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Hable con el administrador',
        });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }
        const validatePass = bcrypt.compareSync(password, user.password);
        if(!validatePass) {
            return res.status(404).json({
                ok: false,
                message: 'La contraseña no es válida'
            });
        }

        const token = await generateJWT(user.id);
        return res.status(200).json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Hable con el administrador',
        });
    }
};

const renewToken = async (req, res) => {
    const uid = req.uid;
    const token = await generateJWT(uid);
    const user = await User.findById(uid);
    return res.json({
        ok: true,
        user,
        token,
    });
};

module.exports = {
    createUser,
    login,
    renewToken
};