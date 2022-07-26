/*****************************************************
 ** vérifie que le mot de passe valide le schema
 ** ../models/password
 ******************************************************/
const passwordSchema = require("../models/password");
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.writeHead(
      400,
      "Mot de passe requis : 8 caractères minimun. Au moins 1 Majuscule, 1 minuscule, 2 chiffre, 1 1 caractère spécial parmi eux ! @ # $ % ^ & * - + . ? |",
      {
        "content-type": "application/json",
      }
    );
    res.end("Format de mot de passe incorrect");
  } else {
    next();
  }
};
