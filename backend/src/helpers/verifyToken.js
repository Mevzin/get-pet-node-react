const jwt = require("jsonwebtoken");
const getToken = require("./GetToken");

const checkToken = (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(401).json({ message: "Acesso negado!" });
	}

	const token = getToken(req);

	if (!token) return res.status(401).json({ message: "Acesso negado!" });

	try {
		const verified = jwt.verify(token, "secret");
		req.user = verified;
		next();
	} catch (error) {
		return res.stauts(400).json({ message: "Token invalido!" });
	}
};

module.exports = checkToken;
