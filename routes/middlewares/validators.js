const { check, validationResult } = require("express-validator");
const userCtrlr = require( '../../controllers/usuario' );

//Validaciones para usuario
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
    if( body.email !== undefined && body.email !== null ){
        await check('email', 'Email de Usuario obligatorio').not().isEmpty().run( req );
        await check('email', 'El campo debe ser un email valido').isEmail().run( req );
    }
    if( body.telefono !== undefined && body.telefono !== null ) {
        await check( 'telefono', 'El campo debe ser de 10 digitos' ).isLength( { min:10 } ).run( req );
    }
    if( body.fullname !== undefined && body.fullname !== null ) {
        await check( 'fullname', 'fullname no puede ser vacio' ).not().isEmpty().run( req );
    }
    if( body.username !== undefined && body.username !== null ) {
        await check( 'username', 'username no puede ser vacio' ).not().isEmpty().run( req );
    }
    if( body.password !== undefined && body.password !== null ) {
        await check( 'telefono', 'password no puede ser vacio' ).not().isEmpty().run( req );
    }
    await sendErrors( validationResult( req ), res, next );
}

//Validaciones para plato

async function notNullPlato( req, res, next ) {
    const body = req.body;
    if( body.nombre !== undefined && body.nombre !== null ) {
        await check( 'nombre', 'ELcampo no puede ser vacio' ).not().isEmpty().run( req );
    }
    if( body.precio !== undefined && body.precio !== null ) {
        await check( 'precio', 'ELcampo no puede ser vacio' ).not().isEmpty().run( req );
    }
    if( body.img !== undefined && body.img !== null ) {
        await check( 'img', 'ELcampo no puede ser vacio' ).not().isEmpty().run( req );
    }
    await sendErrors( validationResult( req ), res, next );
}

//Respuesta Validacion

async function  sendErrors( validator, res, next ) {
    if( !validator.isEmpty() ) {
        res.send( userCtrlr.onError( validator.array() ) )
    } else {
        next();
    }
}

module.exports = {
    userNewValidate,
    logInValidate,
    updateUser,
    notNullPlato
}