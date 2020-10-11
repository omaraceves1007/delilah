const express = require( 'express' );
const userController = require( '../controllers/usuario' );
const validator = require( './middlewares/validators' );

const router = express.Router();

router.post( '/', validator.userNewValidate, async ( req, res ) => {
    const usuario = req.body;
    userController.createUser( usuario ).then( message => {
        res.send( message );
    } ).catch( err => {
        res.send( userController.onError()
        );
    }) ;
} );

module.exports = router;