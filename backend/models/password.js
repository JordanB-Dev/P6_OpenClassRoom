const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

/*****************************************************
 ** le modèle du mot de passe
 ******************************************************/
passwordSchema
  .is()
  .min(8)
  .is()
  .max(20)
  .has()
  .uppercase(1)
  .has()
  .lowercase()
  .has()
  .symbols(1)
  .has()
  .digits(2)
  .is()
  .not(/[\]()[{}<>`'"/:;,=]/) // caractére non autorisé [\]()[{}<>`'"/:;,=] puis caractére autorisé ! @ # $ % ^ & * - + . ? |
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);

module.exports = passwordSchema;
