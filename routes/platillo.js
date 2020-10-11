const express = require( 'express' );

const router = express.Router();


router.get( '/', ( req, res ) => {
    res.send( 'Todos los Platillos' );
} );


module.exports = router;