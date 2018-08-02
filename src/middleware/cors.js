// Enables cross origin requests from all domains

var cors = function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, userId, authorization, version, platform");
 	next();
}

module.exports = cors