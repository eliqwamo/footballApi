const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (request, response, next) => {

    const bearerHeader = request.headers['authorization'];
    if(bearerHeader){
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        jwt.verify(token, 'x1QEDglfUzusifqP5yoBi4ilFcESkcPP', (err, x) => {
            if(err){
                return response.sendStatus(403);
            } else {
                User.findById(x.id)
                .then(account => {
                    if(account){
                        request.user = account;
                        next();
                    } else {
                        return response.sendStatus(403);
                    }
                })
            }
        })
    } else {
        return response.sendStatus(403);
    }
    //console.log(bearerHeader);

}