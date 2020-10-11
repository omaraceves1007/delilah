const jwt = require("jwt-simple");
const moment = require("moment");
const dotenv = require( 'dotenv' ).config();
const DELILAH = process.env.DELILAH;
const checkToken = (request, response, next) => {
    if (!request.headers.authorization) {
        return response.json({ error: "Falta token" });
    }

    const userToken = request.headers.authorization.replace('Bearer ','');
    let payload = {};
    
    try {
        payload = jwt.decode(userToken, DELILAH);
    } catch (error) {
        return response.json({ error: "Token incorrecto" });
    }

    if (payload.expiredAt < moment().unix) {
        return response.json({ error: "El token ha expirado" });
    }

    request.usuarioId = payload.usuarioId;
    next();
};

module.exports = {
    checkToken: checkToken
}