const express = require( 'express' );
const platoCtrlr = require('../controllers/platillo' );
const token = require( './middlewares/token' );
const rol = require( './middlewares/rol' );
const validate = require( './middlewares/validators' );

const router = express.Router();


router.get( '/', token.checkToken, async ( req, res ) => {
    const result = await platoCtrlr.getAll();
    res.send( result );
} );

router.post( '/', [token.checkToken, rol.checkAdmin, validate.notNullPlato], async( req, res ) => {
    const plato = req.body;
    const result = await platoCtrlr.newPlato( plato );
    res.send( result );
} );

router.put( '/:id', [token.checkToken, rol.checkAdmin, validate.notNullPlato], async( req, res ) => {
    const id = parseInt( req.params.id );
    const plato = req.body;
    const result = await platoCtrlr.updatePlato( plato, id );
    res.send( result );
} );

router.delete( '/:id', [token.checkToken, rol.checkAdmin], async( req, res ) => {
    const id = parseInt( req.params.id );
    const result = await platoCtrlr.deletePlato( id );
    res.send( result );
} );


module.exports = router;