var Discord = require("discord.js");
var bodyParser = require('body-parser');
var basicAuth = require('express-basic-auth');
var https = require('https');
var express = require('express');
var app = express();
var fs = require('fs');
var bot = new Discord.Client();

var lines = [];
var statuses = [];

bot.on('ready', () => {
    chAct();
    var uobj = {};
    uobj[lines[1]] = lines[2];
    app.use(basicAuth({
        users: uobj,
        challenge: true
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    })); 
    app.get('/', function(req, res){
        console.log(req.ip);
        fs.readFile("index.html", "utf8", function (err, data) {
            res.send(data);
        });
    });
    app.get('/name', function(req, res){
        res.send(JSON.stringify(bot.user.username));
    });
    app.get('/jquery', function(req, res){
        res.redirect('https://code.jquery.com/jquery-3.2.1.min.js');
    });
    app.get('/image.png', function(req, res){
        res.redirect(bot.user.avatarURL);
    });
    
    app.post('/online', function(req, res){
        bot.user.setStatus('online');
        res.send('ok');
    });
    
    app.post('/idle', function(req, res){
        bot.user.setStatus('idle');
        res.send('ok');
    });
    
    app.post('/dnd', function(req, res){
        bot.user.setStatus('dnd');
        res.send('ok');
    });
    
    app.post('/invisible', function(req, res){
        bot.user.setStatus('invisible');
        res.send('ok');
    });
    
    app.post('/msg', function(req, res){
        var guild = bot.guilds.get(req.body.gid);
        if(guild == undefined) return;
        var channel = guild.channels.get(req.body.cid);
        if(channel == undefined) return;
        channel.send(req.body.msg);
        res.send('ok');
    });
    app.get('/data', function(req, res){
        var ret = [];
        var gar = bot.guilds.array();
        for(var i = 0; i < gar.length; i++){
            var g = gar[i];
            var put = {
                "server": g.name,
                "gid": g.id,
                "emojis": [], 
                "users": [],
                "roles": [],
                "channels": []
            };
            var ear = g.emojis.array();
            for(var j = 0; j < ear.length; j++){
                var e = ear[j];
                put.emojis.push({
                    "name": e.name,
                    "url": e.url,
                    "string": e.toString()
                });
            }
            
            put.emojis.sort(function(a, b){
                return ( a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
            });
            
            var uar = g.members.array();
            for(var j = 0; j < uar.length; j++){
                var u = uar[j];
                put.users.push({
                    "name": u.user.tag,
                    "nick": u.displayName,
                    "string": u.toString()
                });
            }
            var b = false;
            put.users.sort(function(a, b){
                if(b) return ( a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
                else  return ( a.nick.toLowerCase() < b.nick.toLowerCase() ? -1 : 1);
            });
            
            var rar = g.roles.array();
            for(var j = 0; j < rar.length; j++){
                var r = rar[j];
                put.roles.push({
                    "name": r.name,
                    "string": r.toString()
                });
            }
            put.roles.sort(function(a, b){
                return ( a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
            });
            
            var car = g.channels.array();
            for(var j = 0; j < car.length; j++){
                var c = car[j];
                if(c.type == 'text'){
                    put.channels.push({
                        "name": c.name,
                        "id": c.id,
                        "perm": c.permissionsFor(g.me).has('SEND_MESSAGES'),
                        "string": c.toString()
                    });
                }
            }
            put.channels.sort(function(a, b){
                return ( a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
            });
            
            ret.push(put);
        }
        res.send(JSON.stringify(ret));
    });
    app.listen(lines[3]);
//    var options = {};
//    https.createServer(options, function(req, res){
//        app.handle(req, res);
//    }).listen(12345);
});

function chAct(){
    // {"a":"WATCHING","b":"some paint dry"}
    var options = [];
    statuses.forEach(s => {
	if(s.length == 0) return;
        var input = /([wp]) (.*)/.exec(s);
	options.add({
            "a": input[1],
	    "b": input[2]
	});
    });
    
    if(options.length != 0){
        var index = Math.floor(Math.random() * options.length);
        console.log(options[index]);
        bot.user.setActivity(options[index].b, {
            "type":options[index].a
        });
    }
    setTimeout(chAct, 600000);
}

fs.readFile("config.txt", "utf8", function (err, data) {
    lines = data.split('\r').join('').split('\n');
    bot.login(lines[0]);
});

fs.readFile("say.txt", "utf8", function (err, data) {
    statuses = data.split('\r').join('').split('\n');
});
