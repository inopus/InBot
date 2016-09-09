#!/bin/env node

var request = require('request');

module.exports = {

    configura: function (app) {
        app.get('/webhook', function (req, res) {
            if (req.query['hub.verify_token'] === 'oconselho_token') {
                res.send(req.query['hub.challenge']);
            }
            res.send('Error, wrong token');
        });
    },

    enviaMensagem: function (appToken, users, text, urlImg) {

        var messageData;

        if (!urlImg) {
            messageData = {
                text: text
            }
        } else {
            messageData = {
                'attachment': {
                    'type': "image",
                    'payload': {
                        'url': urlImg
                    }
                }
            }
        }

        console.log(messageData);

        for (var i = 0; i < users.length; i++) {
            request({
                url: 'https://graph.facebook.com/v2.6/me/messages',
                qs: {
                    access_token: appToken
                },
                method: 'POST',
                json: {
                    recipient: {
                        id: users[i]
                    },
                    message: messageData,
                }
            }, function (error, response, body) {
                if (error) {
                    console.log('Erro ao enviar a mensagem: ', error);
                } else if (response.body.error) {
                    console.log('Erro: ', response.body.error);
                }
            });
        }
    }
};