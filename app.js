const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res, next) => {
	res.json({
		message: "welcome to the api"
	});
});

app.post("/api/posts", verifyToken, (req, res, next) => {
	jwt.verify(req.token, "secretkey", (err, authData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			res.json({
				message: "post created...",
				authData
			});
		}
	});
});

app.post("/api/login", (req, res, next) => {
	//mock user
	const user = {
		id: 1,
		username: "paul",
		email: "paul@hotmail.com"
	};
	jwt.sign({ user }, "secretkey", { expiresIn: "30s" }, (err, token) => {
		res.json({
			token
		});
	});
});

// verifyToken
function verifyToken(req, res, next) {
	// get auth header value
	const bearerHeader = req.headers["authorization"];
	// check if bearer is undefined
	if (typeof bearerHeader !== "undefined") {
		//  spit at the space
		const bearer = bearerHeader.split(" ");
		// get token from array
		const bearerToken = bearer[1];
		// set the token
		req.token = bearerToken;
		// next middlewre
		next();
	} else {
		// forbidden
		res.sendStatus(403);
	}
}

app.listen(3000, () => {
	console.log("listening on port 3000");
});
