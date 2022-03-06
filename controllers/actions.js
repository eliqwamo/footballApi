const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Match = require('../models/match');

//READ
router.get('/getMatches', async(request, response) => {
    //VERSION 1
    // try {
    //     const matches = await Match.find();
    //     return response.status(200).json({
    //         message: matches
    //     })
    // } catch (error) {
    //     return response.status(500).json({
    //         message: error
    //     })
    // }

    //VERSION 2
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










module.exports = router;