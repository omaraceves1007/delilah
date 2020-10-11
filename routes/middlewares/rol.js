// const mariadb = require( '../../conexion' );
const jwt = require("jwt-simple");
const dotenv = require( 'dotenv' ).config();
const DELILAH = process.env.DELILAH;

function checkAdmin( req, res, next ) {
    if (!req.headers.authorization) {
        return res.json( { error: "Falta token" } );
    }
    const userToken = req.headers.authorization.replace('Bearer ','');
    let payload = {};
    try {
        payload = jwt.decode(userToken, DELILAH);
    } catch (error) {
        return res.json( { error: "Token incorrecto" } );
    }
    if( payload.usuario.rol === 'ADMIN' ) {
        next();
    } else {
        return res.json( { status: 401, ok:false, error: "Sin permiso" } );
    }
}

async function hasAdmin( id ) {
    const rols = await mariadb.query('SELECT * FROM rol_usuario' , { type: mariadb.QueryTypes.SELECT } );
    let exist = rols.find( found => found.usuario_id == id && found.rol_id === 1 );
    if( exist ) {
        return true;
    }
    return false;
}

module.exports = {
    checkAdmin
}