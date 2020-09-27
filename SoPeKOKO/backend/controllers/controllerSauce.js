const Sauce = require('../models/sauce');
const fileSystem = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObjet = JSON.parse(req.body.sauce);
    delete sauceObjet._id;
    const sauce = new Sauce({
        ...sauceObjet,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet Enregistrer' }))
        .catch(error => res.status(400).json({ error }));
};

exports.search = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

exports.searchOne = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObjet = req.file?
        {
            ...JSON.parse(req.body),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, {...sauceObjet, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'objet modifié' }))
        .catch(error => res.stauts(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fileSystem.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'objet supprimé' }))
                    .catch(error => res.stauts(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.sauceLike = (req, res, next) => {
    const likeStatus = req.body.like;
    const userId = req.body.userId;
    const thisSauceId = req.params.id;
    Sauce.findOne({ _id: thisSauceId })
        .then(sauce => {
            if (likeStatus === 1) {
                console.log(userId + 'vous aimer cette sauce');
                Sauce.updateOne({ _id: thisSauceId },
                    {
                        $push: { userLiked: userId },
                        $inc: { likes: +1 },
                    }
                )
                    .then(() => res.status(200).json({ message: 'Vous aimer cette sauce !' }))
                    .catch((error) => res.status(400).json({ error }))
            }

            if (likeStatus === -1) {
                console.log(userId + 'vous n"aimer pas cette sauce');
                Sauce.updateOne({ _id: thisSauceId },
                    {
                        $push: { userDisliked: userId },
                        $inc: { dislikes: +1 },
                    }
                )
                    .then(() => res.status(200).json({ message: "Vous n'aimer pas cette sauce" }))
                    .catch((error) => res.status(400).json({ error }))
            }

            if (likeStatus === 0) {
                console.log(userId + 'vous annuler votre choix');
                const indexLiked = sauce.usersLiked.indexOf(userId);
                if (indexLiked > -1) {
                    sauce.usersLiked.slice(indexLiked, 1);
                    Sauce.updateOne({ _id: thisSauceId },
                        {
                            $push: {
                                usersliked: {
                                    $each: [],
                                    $slice: indexLiked
                                }
                            },
                            $inc: { likes: -1 },
                        }
                    )
                        .then(() => res.status(200).json({ message: " " }))
                        .catch((error) => res.status(400).json({ error }))

                } else if (indexLiked === -1) {
                    const indexDisliked = sauce.usersDisliked.indexOf(userId);
                    sauce.usersDisliked.slice(indexDisliked, 1);
                    Sauce.updateOne({ _id: thisSauceId },
                        {
                            $push: {
                                usersDisliked: {
                                    $each: [],
                                    $slice: indexDisliked
                                }
                            },
                            $inc: { dislikes: -1 },
                        }
                    )
                        .then(() => res.status(200).json({ message: " " }))
                        .catch((error) => res.status(400).json({ eror }))
                }
            }
        })
        .catch((error) => res.status(400).json({ error }))
}