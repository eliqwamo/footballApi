const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Match = require('../models/match');

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
    //1.  is user exist in db?
    //2.  crytp password
    //3.  generate passcode
    //4.  create new account
    //5.  response (passcode)
})
router.post('/verifyAccount', async(request, response) => {
    const {email,passcode} = request.body;
    //1.  is user exist?
    //2.  is passcode match
    //3.  update user in db (approved)
    //4.  response
})
router.post('/login', async(request, response) => {
    const {email,password} = request.body;
    //1.  is user exist?
    //2.  password match
    //3.  user approved
    //4.  generate token
    //5.  response

})
module.exports = router;