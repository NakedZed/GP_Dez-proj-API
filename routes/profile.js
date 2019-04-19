const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


const Profile = require('../models/Profile')
const User = require('../models/User')


router.get('/test', (req, res) => {
    res.json({
        msg: 'profile works'
    })
})


//@route GET profile
//@desc Get current user`s profile
//@access private

router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const errors = {};

    Profile.findOne({
            user: req.user.id
        })
        .then((profile) => {
            if (!profile) {
                errors.noprofile = 'No profile'
                return res.status(404).json(erros);
            }
            res.json(profile)
        }).catch(err => res.status(404).json(err))

});

//@route GET profile/handle/:handle
//@desc create user profile
//@access private

router.get('/handle/:handle', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    Profile.findOne({
            handle: req.params.handle
        })
        .populate('user', ['name'])
        .then(profile => {
            if (!profile) {
                res.status(400).send('there is no profile');

            }
            res.json(profile)
        }).catch(err => res.status(404).json(err))
})




//@route post profile
//@desc create user profile
//@access private

router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    //Get field
    profileFields = {};
    profileFields.user = req.user.id; //includes name,email (its the logged in user)
    if (req.body.handle)
        profileFields.handle = req.body.handle;
    if (req.body.number)
        profileFields.number = req.body.number;

    Profile.findOne({
        user: req.user.id
    }).
    then(profile => {
        if (profile) {
            Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            }).
            then(profile => res.json(profile))

        } else {
            //Create Profile
            //check if handle exists
            Profile.findOne({
                handle: profileFields.handle
            }).then((profile) => {
                if (profile) {

                    res.status(400).json('That handle already exists');

                }
                //save a new profile
                new Profile(profileFields).save().
                then(profile => res.json(profile)).
                catch(err => res.json(err))
            })

        }
    })



});


module.exports = router;