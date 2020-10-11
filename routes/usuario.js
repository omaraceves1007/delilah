const express = require( 'express' );
const mariadb = require( '../conexion' );
const usuarioCtrlr = require( '../controllers/usuario' );
const token = require( './middlewares/token' ); 
const validate = require( './middlewares/validators' );

const router = express.Router();

router.get( '/', ( req, res ) => {
    mariadb.query( 'SELECT * FROM usuario' , { type: mariadb.QueryTypes.SELECT } )
    .then( usuarios => {
        res.send( usuarios );
    } )
    .catch( console.log );
} );

router.get( '/:id', token.checkToken, async (req , res ) => {
    const ID = parseInt( req.params.id );
    const message = await usuarioCtrlr.findById( ID );
    res.send( message );
});

router.put( '/:id', [token.checkToken, validate.updateUser], async ( req, res ) => {
    const ID = parseInt( req.params.id );
    const data = req.body;
    const result = await usuarioCtrlr.updateUser( ID, data );
    res.send( result );
} );

router.delete( '/:id', token.checkToken, async ( req, res ) => {
    const ID = parseInt( req.params.id );
    const result = await usuarioCtrlr.deleteUser( ID );
    res.send( result );
} );


module.exports = router;