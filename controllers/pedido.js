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

function message( status, ok , info ) {
    return {
        status,
        ok,
        info
    }
}

module.exports = {
    getAll,
    savePedido
}