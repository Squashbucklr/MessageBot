var Discord = require("discord.js");
var bodyParser = require('body-parser');
var basicAuth = require('express-basic-auth');
var https = require('https');
var express = require('express');
var app = express();
var fs = require('fs');
var bot = new Discord.Client();

var lines = [];

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
    app.listen(12345);
//    var options = {};
//    https.createServer(options, function(req, res){
//        app.handle(req, res);
//    }).listen(12345);
});

function chAct(){
    // {"a":"WATCHING","b":"some paint dry"}
    var options = [
        {"a":"WATCHING","b":"some paint dry"},
        {"a":"WATCHING","b":"Spongebob"},
        {"a":"WATCHING","b":"the grass grow"},
        {"a":"WATCHING","b":"a pot boil"},
        {"a":"WATCHING","b":"you. turn around"},
        {"a":"WATCHING","b":"you suffer"},
        {"a":"WATCHING","b":"important videos"},
        {"a":"WATCHING","b":"memes"},
        {"a":"WATCHING","b":"the day go by"},
        {"a":"WATCHING","b":"anything but anime"},
        {"a":"WATCHING","b":"communism fail"},
        {"a":"WATCHING","b":"definitely not porn"},
        {"a":"WATCHING","b":"static"},
        {"a":"WATCHING","b":"over everyone"},
        {"a":"WATCHING","b":"you fail"},
        {"a":"WATCHING","b":"everything burn"},
        {"a":"PLAYING","b":"ghost raccoon"},
        {"a":"PLAYING","b":"PONG (1972)"},
        {"a":"PLAYING","b":"ET of Atari 2600"},
        {"a":"PLAYING","b":"Knack II"},
        {"a":"PLAYING","b":"beer pong"},
        {"a":"PLAYING","b":"with matches"},
        {"a":"PLAYING","b":"with fire"},
        {"a":"PLAYING","b":"outside"},
        {"a":"PLAYING","b":"whatever bots play"},
        {"a":"PLAYING","b":"papa ohnos puddle glands"},
        {"a":"PLAYING","b":"what the cool kids do"}
        {"a":"PLAYING","b":"SPURTZ"}
        {"a":"PLAYING","b":"with my bear"}
        {"a":"PLAYING","b":"with my raccoon"}
    ];
    
    var index = Math.floor(Math.random() * options.length);
    console.log(options[index]);
    bot.user.setActivity(options[index].b, {
        "type":options[index].a
    });
    setTimeout(chAct, 600000);
}

fs.readFile("config.txt", "utf8", function (err, data) {
    lines = data.split('\r').join('').split('\n');
    bot.login(lines[0]);
});
