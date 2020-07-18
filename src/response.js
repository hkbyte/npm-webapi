/**
 * Creates new Response
 * @class
 * @param {*} res res object
 * @param {number} [status=404] HTTP Status Code
 * @param {boolean} [success=false] Success Flag
 * @param {*} [data=undefined] Output data
 * @param {*} [error=undefined] Error object
*/
class Response {
	constructor(res, status = 404, success = false, data = undefined, error = undefined) {
		this.status = status
		this.success = success
		this.data = data
		this.error = error
		this.sendResponse(res)
	}


	/**
	 * Sending Response
	 * @param {*} res res object
	 * @returns {null}
	 */
	sendResponse(res) {
		res.status(this.status).json({
			success: this.success,
			data: this.data,
			error: this.error
		})
	}
}

/**
 * Send Error Response
 * @param {*} res res object
 * @param {*} err Error object
 * @param {boolean} [showStack=false] Send full error stack
 * @returns {null}
 */
function error(res, err, showStack = false) {
	new Response(res, err.httpStatus || 500, false, undefined, {
		name: err.name,
		message: err.message,
		stack: showStack ? err.stack : undefined
	})
}


/**
 * Send Created Response
 * @param {*} res res object
 * @param {*} [created=undefined] Send created data reference
 * @returns {null}
 */
function created(res, created = undefined) {
	new Response(res, 201, true, { created })
}


/**
 * Send Success Response
 * @param {*} res res object
 * @param {*} [data=undefined] Send response data
 * @returns {null}
 */
function success(res, data = undefined) {
	new Response(res, 200, true, data)
}

// Exporting
module.exports = {
	error,
	created,
	success
}