const express = require( 'express' );

const router = express.Router();


router.get( '/', ( req, res ) => {
    res.send( 'Todos los Pedidos' );
} );

router.get( '/:id', ( req, res ) => {
    res.send( 'Un Pedido' );
} );

router.post( '/', ( req, res ) => {
    res.send( 'Nuevo Pedido' );
} );

router.put( '/:id', ( req, res ) => {
    res.send( 'Actualiza Pedido' );
} );

router.delete( '/:id', ( req, res ) => {
    res.send( 'Elimina Pedido' );
} );


module.exports = router;