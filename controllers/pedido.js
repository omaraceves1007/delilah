const mariadb = require( '../conexion' );
const dotenv = require( 'dotenv' ).config();
const moment = require( 'moment' );

async function getAll() {
    const exist = await mariadb.query( 'SELECT id, usuario_id, direccion, pago, hora, tipo_pago, estado FROM pedido',
                            { type: mariadb.QueryTypes.SELECT } );
    if( exist.length > 0 ) {
        return message( 200, true, exist )
    }
    return message( 400, false, 'No se encontraron platillos')
}

async function savePedido( pedido ) {
    let pedidoRes, pedidoMeta, pedido_id, pedPlaRes, pedPlaMe, resultArr=[] ;
    let platos = pedido.platos;
    const hora = moment( new Date( pedido.hora ) ).format( 'YYYY-MM-DD HH:mm:ss');
    let info = Object.values( pedido );
    info.pop();
    info[3] = hora;
    try {
        [ pedidoRes, pedidoMeta ] = await mariadb.query( 'INSERT INTO pedido (usuario_id, direccion, pago, hora, tipo_pago, estado) values(?,?,?,?,?,?)', 
                                            { replacements: info, type: mariadb.QueryTypes.INSERT } );
    } catch( e ) {
        return message( 400, false, 'Error al guardar pedido' );
    }
    if( pedidoMeta === 1 ) {
        pedido_id = await mariadb.query( 'SELECT id FROM pedido where hora = ?',
                        { replacements: [ hora ], type: mariadb.QueryTypes.SELECT } );
        if( pedido_id.length > 0 ) {
            await platos.forEach( async ( plato, index ) => {
                [ pedPlaRes, pedPlaMe ] = await mariadb.query( `INSERT INTO pedido_plato (pedido_id, plato_id, cantidad) values
                                                    (${pedido_id[0].id}, ${plato.plato_id}, ${plato.cantidad})`,
                                                    { type: mariadb.QueryTypes.INSERT } );
                if( pedPlaMe === 1 ) {
                    resultArr.push( pedPlaMe );
                } else {
                    return message( 400, false, 'Error al guardar pedido-plato: ' + index );
                }
            });
        }
        return message( 200, true, 'Pedido guardado correctamente' );
    }
    return message( 500, false, 'Error al guardar pedido' );
}

async function getPedido( id ) {
    try{
        const exist = await mariadb.query( 'SELECT id, usuario_id, direccion, pago, hora, tipo_pago, estado FROM pedido WHERE id = ?',
                        { replacements: [ id ], type: mariadb.QueryTypes.SELECT } );
        const platos = await mariadb.query( `SELECT pp.cantidad, p.nombre, p.precio, p.img FROM pedido_plato pp 
                                            INNER JOIN plato p ON pp.plato_id = p.id 
                                            WHERE pp.pedido_id = ?`,
                        { replacements: [ id ], type: mariadb.QueryTypes.SELECT } );
        if( exist.length > 0 && platos.length > 0 ) {
            const pedido = { ...exist[0], platos: platos};
            return message( 200, true, pedido );
        }
    } catch( err ) {
        return ( 500, false, 'Error al realizar operacion' );
    }
    return message( 400, false, 'No se encontro pedido');
}

async function updatePedido( id, pedido ) {
    pedido.hora = moment( new Date( pedido.hora ) ).format( 'YYYY-MM-DD HH:mm:ss');
    let pedidoRes, pedidoMeta, pedPlaRes, pedPlaMe, resultArr=[];
    let keys = Object.keys( pedido );
    let values = Object.values( pedido );
    let platos = pedido.platos;
    let pedido_d = [];
    let platos_d = [];
    keys.pop();
    values.pop();
    keys.forEach( ( key, i ) => {
        pedido_d.push( `${key}='${values[i]}'` );
    } );
    platos.forEach( ( plt, i ) => {
        platos_d.push( `cantidad='${plt.cantidad}'` );
    } );
    try {
        [ pedidoRes, pedidoMeta ] = await mariadb.query( `UPDATE pedido SET ${pedido_d.toString()} WHERE id = ?` , 
                                            { replacements: [ id ], type: mariadb.QueryTypes.UPDATE } );
    } catch( e ) {console.log(e)
        return message( 400, false, 'Error al Actualizar pedido' );
    }
    if( pedidoMeta === 1 ) {
        await platos_d.forEach( async ( plato, index ) => {
            try{
                [ pedPlaRes, pedPlaMe ] = await mariadb.query( `UPDATE pedido_plato SET ${plato} WHERE pedido_id = ?`,
                                                    { replacements: [ id ], type: mariadb.QueryTypes.UPDATE } );
            } catch( e ){
                console.log(e)
                return message( 400, false, 'Error al guardar pedido-plato: ' + index );
            }
            if( pedPlaMe === 1 ) {
                resultArr.push( pedPlaMe );
            } else {
                return message( 400, false, 'Error al guardar pedido-plato: ' + index );
            }
        } );
        return message( 200, true, 'Pedido guardado correctamente' );
    }
    return message( 500, false, 'Error al guardar pedido' );
}

async function deletePedido( id ) {
    let result;
    try{
        result = await mariadb.query( 'DELETE FROM pedido WHERE id = ?',
            { replacements: [ id ], type: mariadb.QueryTypes.DELETE } );
    }catch( err ){
        return message( 400, false, 'Error al Eliminar pedido' );
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
    savePedido,
    getPedido,
    updatePedido,
    deletePedido
}