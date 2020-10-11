const express = require( 'express' );
const userController = require( '../controllers/usuario' );
const validator = require( './middlewares/validators' );

const router = express.Router();

router.post( '/', validator.logInValidate,  async ( req, res ) => {
    const user = req.body;
    const search = await userController.findBy( user );
    if( search ) {
        res.send( search );
    }
} );

module.exports = router;