/*****************************************************
 ** Middleware qui vérifie que l'utilisateur est
 ** authentifié avant d'autoriser l'envoi de ses requêtes.
 ******************************************************/
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);

    const userId = decodedToken.userId;

    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw error;
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error });
  }
};
