const mariadb = require( '../conexion' );
const dotenv = require( 'dotenv' ).config();

async function getAll() {
    const exist = await mariadb.query( 'SELECT id, nombre, precio, img FROM plato',
                            { type: mariadb.QueryTypes.SELECT } );
    if( exist.length > 0 ) {
        return message( 200, true, exist )
    }
    return message( 400, false, 'No se encontraron platillos')
}

async function newPlato( plato ) {
    let result, metaData;
    try{
        [ result, metaData ] = await mariadb.query( 'INSERT INTO plato(nombre, precio, img) values(?,?,?)',
                                        { replacements: Object.values( plato ), type: mariadb.QueryTypes.INSERT } );
    }catch(err){
        return message( 400, false, 'Error al guardar plato' );
    }
    if( metaData === 1 ){
        return message( 200, true, 'Plato guardado correctamente' );
    }
    return message( 400, false, 'Error al guardar' );
}

async function updatePlato( plato, id ) {
    const keys = Object.keys( plato );
    const values = Object.values( plato );
    let datas = [];
    let result, metadata;
    for( let i = 0; i < keys.length; i++ ) {
        datas.push( `${keys[i]}='${values[i]}'` );
    }
    try{
        [result, metadata ] = await mariadb.query(`UPDATE plato set ${ datas.toString() } WHERE id = ?`,
                                        { replacements: [ id ], type: mariadb.QueryTypes.UPDATE } );
    } catch( err ) {
        return message( 400, false, 'Error al actualizar plato' );
    }
    if( metadata === 1 ) {
        return message( 200, true, 'Plato Actualizado correctamente' );
    }
    return message( 400, false, 'Error al actualizar' );
}

async function deletePlato( id ) {
    let result;
    try{
        result = await mariadb.query( 'DELETE FROM plato WHERE id = ?',
            { replacements: [ id ], type: mariadb.QueryTypes.DELETE } );
    }catch( err ){
        return message( 400, false, 'Error al Eliminar plato' );
    }
    return message( 200, true, 'Eliminado Correctamente' );
}

function message( status, ok , info ) {
    return {
        status,
        ok,
        info
    }
}

module.exports = {
    getAll,
    newPlato,
    updatePlato,
    deletePlato
}