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

router.get( '/:id', token.checkToken, async ( req, res ) => {
    const id = parseInt( req.params.id );
    const result = await pedidoCtrlr.getPedido( id );
    res.send( result );
} );

router.post( '/', async ( req, res ) => {
    const pedido = req.body;
    const result = await pedidoCtrlr.savePedido( pedido );
    res.send( result );
} );

router.put( '/:id', token.checkToken, async ( req, res ) => {
    const id = req.params.id;
    const pedido = req.body;
    const result = await pedidoCtrlr.updatePedido( id, pedido );
    res.send( result );
} );

router.delete( '/:id', token.checkToken, async ( req, res ) => {
    const id = req.params.id;
    const result = await pedidoCtrlr.deletePedido( id );
    res.send( result );
} );


module.exports = router;