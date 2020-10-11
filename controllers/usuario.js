const mariadb = require( '../conexion' );
const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");
const dotenv = require( 'dotenv' ).config();
const moment = require( 'moment' );
const rol = require( '../routes/middlewares/rol' );


async function createUser( user ) {
    user.password = bcrypt.hashSync( user.password, 10);
    const users = await userExist(user)
    if( users ) {
        return exist();
    }
    const userId = await saveUser( user );
    if( userId ) {
        const rol = await saveRol( user.admin, userId[0].id );
        if( rol ){
            return onSuccess( user );
        }
        return onError();
    } else {
        return onError();
    }
}

async function userExist( user ) {
    let params = [ user.username, user.email ];
    let exist = await mariadb.query('SELECT username, email FROM usuario WHERE username = ? || email = ?',
                { replacements: params, type: mariadb.QueryTypes.SELECT });
    if( exist.length > 0 ) {
        return exist;
    }
    return false;
}

async function saveUser( user ) {
    const USER = Object.values( user );
    USER.pop();
    const[ result, metadata ] = await mariadb.query('INSERT INTO `usuario`(`username`, `fullname`, `email`, `telefono`, `password`) VALUES(?,?,?,?,?)',
        { replacements: USER, type: mariadb.QueryTypes.INSERT } );
    if ( metadata === 1 ) {
        const userId = await findId( user );
        if ( userId ) {
            return userId;
        }
        return false;
    }
}

async function saveRol( rol, userId ) {
    let isAdmin = rol === true ? 1 : 2;
    const rol_usuario = [ isAdmin, userId ];
    const [ result, metadata ] = await mariadb.query('INSERT INTO `rol_usuario` ( `rol_id`, `usuario_id` ) VALUES (?,?)',
        { replacements: rol_usuario, type: mariadb.QueryTypes.INSERT } );
    if( metadata ) {
        return true;
    }
    return false;
}

async function findId( user ) {
    const param = [ user.email ];
    const id = await mariadb.query('SELECT id FROM usuario WHERE email = ?',
        { replacements: param, type: mariadb.QueryTypes.SELECT } );
    if( id ) {
        return id;
    }
    return false;
}

async function findBy( user ) {
    let igual;
    const params = [ user.email ];
    const exist = await mariadb.query('SELECT id, username, fullname, email, telefono, password FROM usuario WHERE email = ?',
                    { replacements: params, type: mariadb.QueryTypes.SELECT });
    igual = bcrypt.compareSync( user.password, exist[0].password );
    if( exist.length > 0 && igual) {
            delete exist[0].password;
            const rol = await findRol( exist[0].id );
            if( rol ) {
                exist[0].rol = rol.descripcion;
            }
            const token = createToken( exist[0] );
            return { status: 200, ok: true, token };
    }
    return { status: 200, ok: true, message: 'Credenciales incorrectas'};
}

async function findRol( id ) {
    const rol_id = await mariadb.query( 'SELECT rol_id FROM rol_usuario where usuario_id = ?',
        { replacements: [ id ], type: mariadb.QueryTypes.SELECT } );
    if( rol_id ) {
        const param = [ rol_id[0].rol_id ];
        const rol = await mariadb.query( 'SELECT descripcion FROM rol WHERE id = ?',
            { replacements: param, type: mariadb.QueryTypes.SELECT } );
        if( rol ) {
            return rol[0];
        }
        return false;
    }
}

async function findById( id ) {
    const params = [ id ];
    const exist = await mariadb.query(`SELECT u.id, u.username, u.fullname, u.email, u.telefono, r.descripcion as rol FROM usuario u 
                                        INNER JOIN rol_usuario ru on u.id = ru.usuario_id
                                        INNER JOIN rol r on ru.rol_id = r.id 
                                        WHERE u.id = ?`,
                    { replacements: params, type: mariadb.QueryTypes.SELECT });
    if( exist.length > 0 ) {
            return { status: 200, ok: true, usuario: exist[0] };
    }
    return { status: 200, ok: true, message: 'Usuario no existe'};
}

async function updateUser( id, info ) {
    const keys = Object.keys( info );
    const values = Object.values( info );
    let datas = [];
    let result, metadata;
    for( let i = 0; i < keys.length; i++ ) {
        datas.push( `${keys[i]}='${values[i]}'` );
    }
    try{
        [result, metadata ] = await mariadb.query(`UPDATE usuario set ${ datas.toString() } WHERE id=?`,
                                        { replacements: [ id ], type: mariadb.QueryTypes.UPDATE } );
    } catch( err ) {
        return message( 400, false, 'Error al actualizar' );    
    }
    if( metadata === 1 ) {
        return message( 200, true, 'Usuario Actualizado correctamente' );
    }
    return message( 400, false, 'Error al actualizar' );
}

function onSuccess( user ) {
    delete user.password;
    return {
        status: 200,
        ok: true,
        message: {
            data: { ...user },
            message: 'Usuario creado correctamente'
        }
    }
}

function onError( error ) {
    if (error) {
        return {
            status: 400,
            ok: false,
            error
        }
    }
    return {
        status: 500,
        ok: false,
        message: 'Error al intentar registrar el usuario'
    }
}

function exist() {
    return {
        status: 500,
        ok: false,
        message: 'Error el usuario ya existe'
    }
}

function message( status, ok, message ) {
    return {
        status,
        ok,
        message
    }
}

const createToken = ( user ) => {
    const secret = process.env.DELILAH;
    const payload = {
        usuario: user,
        createdAt: moment().unix,
        expiredAt: moment().add(2, "hours").unix
    }

    return jwt.encode( payload, secret );
}

module.exports = {
    createUser,
    onError,
    findBy,
    createToken,
    findById,
    updateUser
}