// const mariadb = require( '../../conexion' );
const jwt = require("jwt-simple");
const dotenv = require( 'dotenv' ).config();
const DELILAH = process.env.DELILAH;

function checkAdmin( request ) {
    if (!request.headers.authorization) {
        return response.json({ error: "Falta token" });
    }
    const userToken = request.headers.authorization.replace('Bearer ','');
    let payload = {};
    try {
        payload = jwt.decode(userToken, DELILAH);
    } catch (error) {
        return { error: "Token incorrecto" };
    }
    return payload.usuario;
    // if( !req.headers['user'] ) {
    //     return res.json({ error: "Faltan datos de usuario" });
    // }
    // const user_id = req.headers['user'].id;
    // hasAdmin.then( authority => {
    //     if ( authority ) {
    //         next();
    //     } else {
    //         return res.json({ error: "Sin permisos" });
    //     }
    // });
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