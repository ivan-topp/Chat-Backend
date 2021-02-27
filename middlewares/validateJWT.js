const jwt = require('jsonwebtoken');
const { response } = require("express");

const validateJWT = (req, res = response, next) => {
    try {
        const token = req.header('x-token');
        if(!token){
            res.status(401).json({
                ok: false,
                message: 'No hay token en la petición',
            });
        }
        const { uid } = jwt.verify(token, process.env.JWT_KEY);
        req.uid = uid;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            message: 'Token no válido'
        });
    }
};

module.exports = {
    validateJWT
};