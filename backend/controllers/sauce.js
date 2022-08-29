const Sauce = require("../models/sauce");
const fs = require("fs");

/*****************************************************
 ** GETALLSAUCE accède à toutes les sauces
 ******************************************************/
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => res.status(400).json({ error }));
};

/*****************************************************
 ** GEGETONESAUCE accède à une sauce
 ******************************************************/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

/*****************************************************
 ** CREATESAUCE crée une sauce
 ******************************************************/
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

/*****************************************************
 ** MODIFYSAUCE modifie une sauce
 ******************************************************/
exports.modifySauce = (req, res, next) => {
  let sauceObject = {};
  req.file
    ? Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlinkSync(`images/${filename}`);
        },
        (sauceObject = {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        })
      )
    : (sauceObject = { ...req.body });
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

/*****************************************************
 ** DELETESAUCE supprime une sauce
 ******************************************************/
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(res.status(200).json({ message: "Sauce supprimée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

/*****************************************************
 ** LIKESAUCE  like une sauce
 ******************************************************/
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      let valuevote;
      let vote = req.body.userId;
      let like = sauce.usersLiked;
      let unlike = sauce.usersDisliked;
      let good = like.includes(vote);
      let bad = unlike.includes(vote);
      if (good === true) {
        valuevote = 1;
      } else if (bad === true) {
        valuevote = -1;
      } else {
        valuevote = 0;
      }
      if (valuevote === 0 && req.body.like === 1) {
        sauce.likes += 1;
        sauce.usersLiked.push(vote);
      } else if (valuevote === 1 && req.body.like === 0) {
        sauce.likes -= 1;
        const newUsersLiked = like.filter((f) => f != vote);
        sauce.usersLiked = newUsersLiked;
      } else if (valuevote === -1 && req.body.like === 0) {
        sauce.dislikes -= 1;
        const newUsersDisliked = unlike.filter((f) => f != vote);
        sauce.usersDisliked = newUsersDisliked;
      } else if (valuevote === 0 && req.body.like === -1) {
        sauce.dislikes += 1;
        sauce.usersDisliked.push(vote);
      } else {
        console.log("tentavive de vote illégal");
      }
      Sauce.updateOne(
        { _id: req.params.id },
        {
          likes: sauce.likes,
          dislikes: sauce.dislikes,
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
        }
      )
        .then(() => res.status(201).json({ message: "Vous venez de voter" }))
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    })
    .catch((error) => res.status(404).json({ error }));
};
