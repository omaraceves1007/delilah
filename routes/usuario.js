const express = require( 'express' );
const mariadb = require( '../conexion' );
const usuarioCtrlr = require( '../controllers/usuario' );
const token = require( './middlewares/token' );
const validate = require( './middlewares/validators' );
const rol = require( './middlewares/rol' );

const router = express.Router();

router.get( '/', [token.checkToken, rol.checkAdmin] , async ( req, res ) => {
    const result = await usuarioCtrlr.getAll();
    res.send( result );
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

router.post( '/favoritos', token.checkToken, async ( req, res ) => {
    const info = req.body;
    const result = await usuarioCtrlr.addFav( info );
    res.send( result );
} );


router.delete( '/favoritos/:usuario_id/:plato_id', token.checkToken, async ( req, res ) => {
    const usuario = parseInt( req.params.usuario_id );
    const plato = parseInt( req.params.plato_id );
    const result = await usuarioCtrlr.deleteFav( usuario, plato );
    res.send( result );
} );

module.exports = router;