const { check, validationResult } = require("express-validator");
const userCtrlr = require( '../../controllers/usuario' );

async function userNewValidate( req, res , next ) {
    await check('username', 'Nombre de Usuario obligatorio').not().isEmpty().run( req );
    await check('fullname', 'Nombre obligatorio').not().isEmpty().run( req );
    await check('email', 'Email de Usuario obligatorio').not().isEmpty().run( req );
    await check('email', 'El campo debe ser un email valido').isEmail().run( req );
    await check('password', 'Password de Usuario obligatorio').not().isEmpty().run( req );
    await sendErrors( validationResult( req ), res, next );
}

async function logInValidate( req, res, next ) {
    await check('email', 'Email de Usuario obligatorio').not().isEmpty().run( req );
    await check('email', 'El campo debe ser un email valido').isEmail().run( req );
    await check('password', 'Password de Usuario obligatorio').not().isEmpty().run( req );
    await sendErrors( validationResult( req ), res, next );
}

async function updateUser( req, res, next ) {
    const body = req.body;console.log(body)
    if( body.email !== undefined && body.email !== null ){console.log('email')
        await check('email', 'Email de Usuario obligatorio').not().isEmpty().run( req );
        await check('email', 'El campo debe ser un email valido').isEmail().run( req );
    }
    if( body.telefono !== undefined && body.telefono !== null ) {console.log('telefono')
        await check( 'telefono', 'El campo debe ser de 10 digitos' ).isLength( { min:10 } ).run( req );
    }
    if( body.fullname !== undefined && body.fullname !== null ) {console.log('fullname')
        await check( 'fullname', 'fullname no puede ser vacio' ).not().isEmpty().run( req );
    }
    if( body.username !== undefined && body.username !== null ) {console.log('username')
        await check( 'username', 'username no puede ser vacio' ).not().isEmpty().run( req );
    }
    if( body.password !== undefined && body.password !== null ) {console.log('password')
        await check( 'telefono', 'password no puede ser vacio' ).not().isEmpty().run( req );
    }
    await sendErrors( validationResult( req ), res, next );
}

async function  sendErrors( validator, res, next ) {console.log(validator.array())
    if( !validator.isEmpty() ) {
        res.send( userCtrlr.onError( validator.array() ) )
    } else {
        next();
    }
}

module.exports = {
    userNewValidate,
    logInValidate,
    updateUser
}