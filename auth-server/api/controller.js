'use strict';

var authorizedRequestCount = 0;

exports.refresh = function (req, res) {
    res.status(200).json(JSON.stringify({access_token: 'access_token', refresh_token: 'refresh_token'}));
};

exports.todos = function (req, res) {
    authorizedRequestCount += 1;
    if (authorizedRequestCount % 3 === 0) {
        res.sendStatus(401);
    } else {
        res.json(JSON.stringify({todos: []}));
    }
};

exports.fail = function (req, res) {
    res.sendStatus(401);
};