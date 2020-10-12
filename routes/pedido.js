const express = require( 'express' );
const token = require( './middlewares/token' );
const rol = require( './middlewares/rol' );
const validate = require( './middlewares/validators' );
const pedidoCtrlr = require( '../controllers/pedido' );

const router = express.Router();


router.get( '/', [ token.checkToken, rol.checkAdmin ], async ( req, res ) => {
    const result = pedidoCtrlr.getAll();
    res.send( result );
} );

router.get( '/:id', async ( req, res ) => {
    res.send( 'Un Pedido' );
} );

router.post( '/', async ( req, res ) => {
    const pedido = req.body;
    const result = await pedidoCtrlr.savePedido( pedido );
    res.send( result );
} );

router.put( '/:id', async ( req, res ) => {
    res.send( 'Actualiza Pedido' );
} );

router.delete( '/:id', async ( req, res ) => {
    res.send( 'Elimina Pedido' );
} );


module.exports = router;