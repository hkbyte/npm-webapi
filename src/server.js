// Importing
const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')
const helmet = require('helmet')

/**
 * Server Intilization Function
 * @param {Object} [options={}]
 * @param {string} [options.limit='100kb'] Body Parser Limit Size
 * @param {boolean} [options.helmet=true] Use helmet 
 * @param {Object} [options.cors={}] Access-Control-Allow-Methods CORS Options
 * @param {Array} [options.cors.origins=[]] Set origin to an array of valid origins. Each origin can be a String or a RegExp
 * @param {Array} [options.cors.methods=['GET','HEAD','PUT','PATCH','POST','DELETE']] Configures the Access-Control-Allow-Methods CORS header
 * @param {Array} [options.cors.allowedHeaders=] Configures the Access-Control-Allow-Headers CORS header. If not specified, defaults to reflecting the headers specified in the request's Access-Control-Request-Headers header
 * @param {boolean} [options.cors.preflightContinue=false] Pass the CORS preflight response to the next handler.
 * @param {number} [options.cors.optionsSuccessStatus=204] Provides a status code to use for successful OPTIONS requests, since some legacy browsers (IE11, various SmartTVs) choke on 204 use 200 instead
 * @returns {*} Express Server Object
 */
function start(options = {}) {
	// Initializing Express
	const app = express()

	// Helmet : Request Header Protection
	let helmetOption = options.helmet || true
	if (helmetOption) {

		app.use(helmet())
	}

	// CORS : Allowing Cross Domian Access
	if (options.cors) {
		// Default Values
		let corsOptions = {
			origin: options.cors.origins || "*",
			methods: options.cors.methods ? options.cors.methods.join(",") : "GET,HEAD,PUT,PATCH,POST,DELETE",
			preflightContinue: options.cors.preflightContinue || false,
			optionsSuccessStatus: options.cors.optionsSuccessStatus || 204
		}

		if (options.cors.allowedHeaders) {
			corsOptions.allowedHeaders = options.cors.allowedHeaders.join(",")
		}

		app.use(cors(corsOptions))
	}
	else {
		app.use(cors())
	}

	// Option: Limit
	let limit = options.limit || '100kb'

	// Request Body Parser
	app.use(bodyParser.json({ limit }))
	app.use(bodyParser.urlencoded({ limit, extended: true }))

	// Returning
	return app
}

// Exporting
module.exports = {
	start
}

