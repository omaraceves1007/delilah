const express = require( 'express' );
const dotenv = require ( 'dotenv' ).config();
const bodyParser = require( 'body-parser' );
const apiRouter = require( './routes/api' );

const app = express();
const PORT = process.env.PORT;

app.use( (req, res, next ) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
} );

// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: false } ) );
// parse application/json
app.use(bodyParser.json());

app.use( '/api', apiRouter );
app.get( '/', ( req, res ) => res.send( 'Hello dotenv' ) );

app.listen( PORT, () => console.log( 'Online in: ', PORT ) );