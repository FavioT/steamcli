const async = require('async');
const request = require('request');
const colors = require('colors');

// Get user config, APIKey and SteamIDs
const config = require('./config/userconfig.js');

// Get IDs of total owned games
const allGames = require('./config/allgames.js');

/**
 * @function    [createUsrInterface]
 * @summary     Implement terminal user interface with 'blessed'
 */
const createUsrInterface = (params) => {
    let blessed = require('blessed')
        , screen;

    let auto = true;

    screen = blessed.screen({
        smartCSR: true,
        dockBorders: true,
        warnings: true
    });

    let topLeftContent = '\n' +
        colors.yellow('SteamID: ') + '\t' +
        colors.green(params.user.steamId) + '\n' +
        colors.yellow('Nickname: ') + '\t' +
        colors.green(params.user.nickName) + '\n' +
        colors.yellow('Realname: ') + '\t' +
        colors.green(params.user.realName) + '\n' +
        colors.yellow('LastLogoff: ') + '\t' +
        colors.green(params.user.lastLogOff) + '\n' +
        colors.yellow('Country: ') + '\t' +
        colors.green(params.user.country) + '\n' +
        '\n';

    let aditionalInfo = '' +
        colors.red('CommunityBanned: ') + '\t' +
        colors.green(params.bans[0].CommunityBanned ? 'Yes' : 'No') + '\n' +
        colors.red('VACBanned: ') + '\t' +
        colors.green(params.bans[0].VACBanned ? 'Yes' : 'No') + '\n' +
        colors.red('NumberOfVACBans: ') + '\t' +
        colors.green(params.bans[0].NumberOfVACBans) + '\n' +
        colors.red('DaysSinceLastBan: ') + '\t' +
        colors.green(params.bans[0].DaysSinceLastBan) + '\n' +
        colors.red('NumberOfGameBans: ') + '\t' +
        colors.green(params.bans[0].NumberOfGameBans) + '\n';

    let topRightContent = [
        ['Game Name', 'Game ID', 'Hours Played']
    ];

    for (let item in params.games) {
        topRightContent.push([ params.games[item].name, params.games[item].appId.toString(), params.games[item].hoursPlayed.toString() ]);
    }

    let bottomLeftContent = '';

    for (let item in params.news) {
        var date = new Date(params.news[item].date * 1000).toUTCString();

        bottomLeftContent += '\n' +   
        'Title: ' + colors.green(params.news[item].title) + '\n' +        
        'Feed: ' + colors.red(params.news[item].feedlabel) + '\n' +
        'URL: ' + colors.yellow(params.news[item].url) + '\n' +        
        'Date: ' + colors.magenta(date) + '\n' +        
        '';
    }

    let topleft = blessed.box({
        parent: screen,
        label: ' User info ',
        left: 0,
        top: 0,
        width: '49%',
        height: '49%',
        style: {
            fg: 'default',
            bg: 'default',
            border: {
              fg: 'green',
              bg: 'default'
            },
            selected: {
              bg: 'green'
            }
          },
        border: 'line',
        content: topLeftContent + aditionalInfo
    });

    let topright = blessed.listtable({
        parent: screen,
        label: ' Games library ',
        left: '50%-1',
        top: 0,
        width: '49%+1',
        height: '49%',
        border: {
            type: 'line',
            left: true,
            top: false,
            right: false,
            bottom: false
        },
        border: 'line',
        align: 'center',
        tags: true,
        keys: true,
        vi: true,
        mouse: true,
        style: {
            header: {
                fg: 'blue',
                bold: true
            },
            cell: {
                fg: 'magenta',
                selected: {
                    bg: 'blue'
                }
            },
            border: {
              fg: 'yellow',
              bg: 'default'
            },
        },
        data: topRightContent
    });

    let bottomleft = blessed.box({
        parent: screen,
        label: ' Recent News ',
        left: 0,
        top: '50%-1',
        width: '49%',
        height: '49%+1',
        border: {
            type: 'line',
            left: false,
            top: true,
            right: false,
            bottom: false
        },
        border: 'line',
        style: {
            fg: 'default',
            bg: 'default',
            border: {
              fg: 'red',
              bg: 'default'
            },
            selected: {
              bg: 'green'
            }
          },
        scrollable: true,
        alwaysScroll: true,
        mouse: true,
        scrollbar: {
            ch: ' ',
            track: {
              bg: 'yellow'
            },
            style: {
              inverse: true
            }
          },

        content: bottomLeftContent
    });



    let bottomright = blessed.listtable({
        parent: screen,
        label: ' Other data ',
        left: '50%-1',
        top: '50%-1',
        width: '49%+1',
        height: '49%+1',
        border: {
            type: 'line',
            left: true,
            top: true,
            right: false,
            bottom: false
        },
        border: 'line',
        align: 'center',
        tags: true,
        keys: true,
        vi: true,
        mouse: true,
        style: {
            header: {
                fg: 'blue',
                bold: true
            },
            cell: {
                fg: 'magenta',
                selected: {
                    bg: 'blue'
                }
            }
        },
        data: [
            ['Animals', 'Foods', 'Times', 'Numbers'],
            ['Elephant', 'Apple', '1:00am', 'One'],
            ['Bird', 'Orange', '2:15pm', 'Two'],
            ['T-Rex', 'Taco', '8:45am', 'Three'],
            ['Mouse', 'Cheese', '9:05am', 'Four']
        ]
    });

    var bar = blessed.listbar({
          //parent: screen,
          bottom: 0,          
          left: 3,
          right: 3,
          height: auto ? 'shrink' : 3,
          mouse: true,
          keys: true,
          autoCommandKeys: true,
          border: 'line',
          vi: true,
          style: {
            bg: 'green',
            item: {
              bg: 'red',
              hover: {
                bg: 'blue'
              },
              //focus: {
              //  bg: 'blue'
              //}
            },
            selected: {
              bg: 'blue'
            }
          },
          commands: {
            'one': {
              keys: ['a'],
              callback: function() {
                box.setContent('Pressed one.');
                screen.render();
              }
            },
            'two': function() {
              box.setContent('Pressed two.');
              screen.render();
            },
            'three': function() {
              box.setContent('Pressed three.');
              screen.render();
            },
            'four': function() {
              box.setContent('Pressed four.');
              screen.render();
            },
            'five': function() {
              box.setContent('Pressed five.');
              screen.render();
            },
            'six': function() {
              box.setContent('Pressed six.');
              screen.render();
            },
            'seven': function() {
              box.setContent('Pressed seven.');
              screen.render();
            },
            'eight': function() {
              box.setContent('Pressed eight.');
              screen.render();
            },
            'nine': function() {
              box.setContent('Pressed nine.');
              screen.render();
            },
            'ten': function() {
              box.setContent('Pressed ten.');
              screen.render();
            },
            'eleven': function() {
              box.setContent('Pressed eleven.');
              screen.render();
            },
            'twelve': function() {
              box.setContent('Pressed twelve.');
              screen.render();
            },
            'thirteen': function() {
              box.setContent('Pressed thirteen.');
              screen.render();
            },
            'fourteen': function() {
              box.setContent('Pressed fourteen.');
              screen.render();
            },
            'fifteen': function() {
              box.setContent('Pressed fifteen.');
              screen.render();
            }
          }
        });

    screen.append(bar);

    bar.focus();

    screen.title = 'A humble node.js dashboard.';

    screen.key('q', function () {
        return screen.destroy();
    });

    screen.render();
}


/**
 * @function    [getUI]
 * @returns     {Json}
 * @summary     Get Steam user data from GET requests.
 */
const getUI = () => {

    async.parallel({
        user: function (callback) {        
            let url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + config.user.apiKey + '&steamids=' + config.user.steamIds + '&format=json';

            request( url, function (error, response, body) {
                let dataObj     = JSON.parse(body),
                    resultObj   = {};

                dataObj.response.players.forEach(function(info) {
                    resultObj.steamId = info.steamid;
                    resultObj.nickName = info.personaname;
                    resultObj.lastLogOff = new Date(info.lastlogoff * 1000).toUTCString();
                    resultObj.realName = info.realname;
                    resultObj.country = info.loccountrycode;
                });

                return callback(null, resultObj);
            });
        },
        games: function (callback) {
            let url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + config.user.apiKey + '&steamid=' + config.user.steamIds + '&include_appinfo=1format=json';

            request( url, function (error, response, body) {
                let dataObj = JSON.parse(body),
                    resultObj = [];

                dataObj.response.games.forEach(function(game){
                    resultObj.push({ 'name': game.name, 'appId': game.appid, 'hoursPlayed': game.playtime_forever });
                });

                return callback(null, resultObj);
            });
        },
        news: function (callback) {
            let gameId = allGames[Math.floor(Math.random()*allGames.length)];

            let url = 'http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=' + gameId + '&count=10&maxlength=300&format=json';

            request( url, function (error, response, body) {
                let dataObj = JSON.parse(body);

                return callback(null, dataObj.appnews.newsitems);
            });
        },
        bans: function (callback) {
            let url = 'http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=' + config.user.apiKey + '&steamids=' + config.user.steamIds + '';

            request( url, function (error, response, body) {
                let dataObj = JSON.parse(body);
                
                return callback(null, dataObj.players);
            });
        },
        archievements: function (callback) {
            let url = 'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=227300&key=' + config.user.apiKey + '&steamid=' + config.user.steamIds + '';

            request( url, function (error, response, body) {
                let dataObj = JSON.parse(body);
                
                return callback(null, dataObj.players);
            });
        }
    }, function (err, results) {
            createUsrInterface(results);
        });
}

// Export all methods
module.exports = { getUI };