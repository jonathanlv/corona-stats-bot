var TelegramBot = require("node-telegram-bot-api");
var token = 'YOUR_TOKEN';
var bot = new TelegramBot(token, {polling: true});
var request = require('request');
var emoji = require('node-emoji').emoji;

//Username on telegram: CoronaStatsBot_bot

//To get instructions on how to use the app:

bot.on('message', (msg) => {
    var chatId=msg.chat.id;
    var Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0 || msg.text.toString().toLowerCase()==="hej") {
        bot.sendMessage(chatId, "Hello. I am CoronaStats. To view statistics for a country, type 'Corona country'. To view statistics for the whole world, type 'Corona world'");
    }   
});

//Get statistics for the whole world:

bot.onText(/\Corona (.+)/, function(msg,match){
    var location = match[1];
    var chatId=msg.chat.id;
    var locationCap = capitalizeLetters(location);

    var url = "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/2/query?f=json&where=Confirmed%20%3E%200&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed%20desc&outSR=102100&resultOffset=0&resultRecordCount=100&cacheHint=true";
    request(url, function (error, response, body){
        
        if(!error && response.statusCode==200){
            
            if(locationCap === "World"){
                var res = JSON.parse(body);
                var confirmedW= 0;
                var deathsW=0;
                var recoveredW=0;
                var deathRatio=0.0;
                var deathPercentageRounded = 0;
                var saveCaseAmount
                for(let item of res.features){
                    confirmedW+=item.attributes.Confirmed;
                    deathsW+=item.attributes.Deaths;
                    recoveredW+=item.attributes.Recovered;

                    saveCaseAmount+=item.attributes.Confirmed;

                    deathRatio = deathsW/confirmedW;

                    deathPercentageRounded = roundNumber(deathRatio)*100;
                }
                
           bot.sendMessage(chatId, "CoronaStats "  + emoji.earth_africa + " Worldwide: " + "\n" + "\nConfirmed cases : " + confirmedW + 
           "\nNumber of deaths: " + deathsW + "\nNumber of recovered: " + recoveredW
           + "\n" + "\nDeath (relative to confirmed cases): "+ deathPercentageRounded + " %");
           
            }
        }
    });
});

//Get statistics for a seperate country:

bot.onText(/\Corona (.+)/, function(msg,match){
    var location = match[1];
    var chatId=msg.chat.id;

    var deathPercentageRounded=0.0;
    
    var url = "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/2/query?f=json&where=Confirmed%20%3E%200&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed%20desc&outSR=102100&resultOffset=0&resultRecordCount=100&cacheHint=true";
    request(url, function (error, response, body){
        
        if(!error && response.statusCode==200){
            
            var locationCap = capitalizeLetters(location);

            if(locationCap === "World"){
                return;
            }else if(locationCap === "China"){
               locationCap = "Mainland China";
               var res = JSON.parse(body);
                var confirmed= 0;
                var deaths=0;
                var recovered=0;
                var deathRatio=0.0;
                for(let item of res.features){
                    if(locationCap===item.attributes.Country_Region){
                        confirmed+=item.attributes.Confirmed;
                        deaths+=item.attributes.Deaths;
                        recovered+=item.attributes.Recovered;

                        deathRatio = deaths/confirmed;

                        deathPercentageRounded = roundNumber(deathRatio)*100;

            }
        }       bot.sendMessage(chatId, "CoronaStats for " + locationCap +" : " + "\n" + "\n" + emoji.chart_with_upwards_trend + " Confirmed cases : " + confirmed + 
                "\n" + emoji.skull + " Number of deaths: " + deaths + "\n" + emoji.heart + " Number of recovered: " + recovered
                + "\n" + "\nDeath (relative to confirmed cases): "+ deathPercentageRounded + " %");

    }else if(locationCap === "United kingdom" || locationCap === "united kingdom" || locationCap === "Uk" || locationCap==="U.k."){
        locationCap = "United Kingdom";
        var res = JSON.parse(body);
        var confirmed = 0;
        var deaths = 0;
        var recovered = 0;
        var deathRatio = 0.0;
        for(let item of res.features){
            if(locationCap === item.attributes.Country_Region){
                confirmed+=item.attributes.Confirmed;
                deaths+=item.attributes.Deaths;
                recovered+=item.attributes.Recovered;

                deathRatio = deaths/confirmed;

                deathPercentageRounded = roundNumber(deathRatio)*100;
            }
        }       bot.sendMessage(chatId, "CoronaStats for " + locationCap +" : " + "\n" + "\n" + emoji.chart_with_upwards_trend + " Confirmed cases : " + confirmed + 
                "\n" + emoji.skull + " Number of deaths: " + deaths + "\n" + emoji.heart + " Number of recovered: " + recovered
                 + "\n" + "\nDeath (relative to confirmed cases): "+ deathPercentageRounded + " %");
    
            }else if(locationCap === "Usa" || locationCap === "Us"){
                locationCap = "US";
               var res = JSON.parse(body);
                var confirmed= 0;
                var deaths=0;
                var recovered=0;
                var deathRatio=0.0;
                for(let item of res.features){
                    if(locationCap===item.attributes.Country_Region){
                        confirmed+=item.attributes.Confirmed;
                        deaths+=item.attributes.Deaths;
                        recovered+=item.attributes.Recovered;

                        deathRatio = deaths/confirmed;

                        deathPercentageRounded = roundNumber(deathRatio)*100;

            }
        }       bot.sendMessage(chatId, "CoronaStats for " + locationCap +" : " + "\n" + "\n" + emoji.chart_with_upwards_trend + " Confirmed cases : " + confirmed + 
                "\n" + emoji.skull + " Number of deaths: " + deaths + "\n" + emoji.heart + " Number of recovered: " + recovered
                + "\n" + "\nDeath (relative to confirmed cases): "+ deathPercentageRounded + " %");
            }else{
                var res = JSON.parse(body);
                var confirmed= 0;
                var deaths=0;
                var recovered=0;
                var deathRatio=0.0;
                for(let item of res.features){
                    if(locationCap===item.attributes.Country_Region){
                        confirmed+=item.attributes.Confirmed;
                        deaths+=item.attributes.Deaths;
                        recovered+=item.attributes.Recovered;

                        deathRatio = deaths/confirmed;

                        deathPercentageRounded = roundNumber(deathRatio)*100;

            }
        }       bot.sendMessage(chatId, "CoronaStats for " + locationCap +" : " + "\n" + "\n" + emoji.chart_with_upwards_trend + " Confirmed cases : " + confirmed + 
                "\n" + emoji.skull + " Number of deaths: " + deaths + "\n" + emoji.heart + " Number of recovered: " + recovered
                + "\n" + "\nDeath (relative to confirmed cases): "+ deathPercentageRounded + " %");
            
            }
            }
        })
    });

    function roundNumber(num) {    
        return +(Math.round(num + "e+2")  + "e-2");
    }
    
    function capitalizeLetters(string) {
        var firstLetter = string.slice(0, 1);
        var secondPart = string.slice(1);
        return firstLetter.toUpperCase() + secondPart.toLowerCase();
    }
