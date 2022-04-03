const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Match = require('../models/match');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

//CREATE
router.post('/createMatch', (request,response) => {
    const { homeTeamName, awayTeamName, homeScore, awayScore, stadium, homeWin } = request.body;
    const id = mongoose.Types.ObjectId();
    const _match = new Match({
        _id: id,homeTeamName,awayTeamName,homeScore,awayScore,stadium,homeWin});
    return _match.save()
    .then(results => {
        return response.status(200).json({
            message: results
        })
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })
})
//READ
router.get('/getMatches', async(request, response) => {
    Match.find()
    .then(results => {
        return response.status(200).json({
            message: results
        })
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })
})
//UPDATE
router.put('/updateMatch/:id', async(request, response) => {
    const matchId = request.params.id;

    Match.findById(matchId)
    .then(match => {
        if(match){
            const { homeTeamName, awayTeamName, homeScore, awayScore, stadium, homeWin } = request.body;
            match.homeTeamName = homeTeamName;
            match.awayTeamName = awayTeamName;
            match.homeScore = homeScore;
            match.awayScore = awayScore;
            match.stadium = stadium;
            match.homeWin = homeWin;

            return match.save()
            .then(match_updated => {
                return response.status(200).json({
                    message: match_updated
                })
            })

        } else {
            return response.status(404).json({
                message: 'This game is not exist'
            })
        }
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })
})
//DELETE
router.delete('/removeMatch/:id', async(request, response) => {
    const matchId = request.params.id;
    Match.findByIdAndDelete(matchId)
    .then(results => {
        return response.status(200).json({
            message: results
        })
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })
})


//ACCOUNTS
router.post('/createUser', async(request,response) => {
    const {firstName,lastName,email,password} = request.body;
    const id = mongoose.Types.ObjectId();
    //1.  is user exist in db?  
    User.findOne({email : email})
    .then(async account => {
        if(account){
            return response.status(200).json({
                message: 'User exist'
            })
        } else {
            //2.  crytp password
            const hash = await bcryptjs.hash(password,10);
            //3.  generate passcode 
            const code = generateCode(100000,999999);
            //4.  create new account
            const _user = new User({
                _id: id,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hash,
                passcode: code
            })
            return _user.save()
            .then(account_created => {
                return response.status(200).json({
                    message: account_created
                })
            })
        }
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })



    //5.  response (passcode)
})
router.post('/verifyAccount', async(request, response) => {
    const {email,passcode} = request.body;
    //1.  is user exist?

    User.findOne({email : email})
    .then(account => {
        if(account){
            if(parseInt(account.passcode) === parseInt(passcode)) {
                account.isApproved = true;
                return account.save()
                .then(account_updated => {
                    return response.status(200).json({
                        message: account_updated
                    })
                })
            } else {
                return response.status(200).json({
                    message: 'Passcode not match'
                })
            }
        } else {
            return response.status(200).json({
                message: 'User not found'
            })
        }
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })
    //2.  is passcode match
    //3.  update user in db (approved)
    //4.  response
})
router.post('/login', async(request, response) => {
    const {email,password} = request.body;
    //1.  is user exist?
    User.findOne({email: email})
    .then(async account => {
        if(account){

            if(account.isApproved){

                const isMatch = await bcryptjs.compare(password, account.password);
                if(isMatch){

                    const data = {
                        account_name: account.firstName + ' ' + account.lastName,
                        email: account.email,
                        id: account._id 
                    }
                    const token = await jwt.sign(data, 'x1QEDglfUzusifqP5yoBi4ilFcESkcPP');
                    return response.status(200).json({
                        message: token
                    })

                } else {
                    return response.status(200).json({
                        message: 'Password not match, please try again'
                    })
                }

            } else {
                return response.status(200).json({
                    message: 'You need to activate your account'
                })
            }

        } else {
            return response.status(200).json({
                message: 'User not found'
            })
        }
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })
    //2.  password match
    //3.  user approved
    //4.  generate token
    //5.  response
})




function generateCode(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = router;