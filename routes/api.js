const router = require("express").Router();
const cors = require( "cors" );
// const middlewares = require("./middlewares");

// import Routes
const loginRoutes = require( './login' );
const signinRoutes = require( './signin' );
const userRoutes = require( './usuario' );
const orderRoutes = require( './pedido' );
const dishRoutes = require( './platillo' );

//enabled cors for swagger
router.use( cors() );

// Add Routes to aplication
router.use( '/pedidos', orderRoutes );
router.use( '/platillos', dishRoutes );
router.use( '/usuarios', userRoutes );
router.use( '/login', loginRoutes );
router.use( '/signin', signinRoutes );

module.exports = router;