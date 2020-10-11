const { check, validationResult } = require("express-validator");

function userNewValidate( req, res, next ) {
    check('username', 'Nombre de Usuario obligatorio').not().isEmpty();
    check('fullname', 'Nombre obligatorio').not().isEmpty();
    check('email', 'Email de Usuario obligatorio').not().isEmpty().isEmail();
    check('password', 'Password de Usuario obligatorio').not().isEmpty();
    const  errorsVal = validationResult(req);
    if( !errorsVal.isEmpty() ) {
        res.send( userController.onError( errorsVal.array() ) )
    }
    next();
}

function logInValidate( req, res, next ) {
    check('email', 'Email de Usuario obligatorio').not().isEmpty().isEmail();
    check('password', 'Password de Usuario obligatorio').not().isEmpty();
    const  errorsVal = validationResult(req);
    if( !errorsVal.isEmpty() ) {
        res.send( userController.onError( errorsVal.array() ) )
    }
    next();
}

module.exports = {
    userNewValidate,
    logInValidate,
}