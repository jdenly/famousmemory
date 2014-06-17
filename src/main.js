define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Surface = require("famous/core/Surface");
    var GridLayout = require("famous/views/GridLayout");
    var HeaderFooterLayout = require("famous/views/HeaderFooterLayout");
    var EventHandler = require('famous/core/EventHandler');
    var CardView = require("views/CardView");

    // create the main context
    var mainContext = Engine.createContext();

    // your app here
    var cardWidth = window.innerWidth / 4 * 0.9;
    var cardHeight = (window.innerHeight - 50) / 4 * 0.9;

    var player1 = {name: 'Player 1', score: 0, playerNumber: 1};
    var player2 = {name: 'Player 2', score: 0, playerNumber: 2};
    var currentPlayer = player1;

    var layout = new HeaderFooterLayout({
        headerSize: 50,
        footerSize: 0
    });

    mainContext.add(layout);

    var headerContent = getHeaderContent(1);
    var headerSurface = new Surface({
        content: headerContent,
        classes: ["header"],
        properties: {
            lineHeight: "50px",
            textAlign: "center",
            zIndex: -1000
        }
    });
    layout.header.add(headerSurface);

    var grid = new GridLayout({
        dimensions: [4, 4]
    });

    var cards = [];
    grid.sequenceFrom(cards);

    // Create random set of fronts for the cards
    var cardSymbols = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
    cardSymbols = shuffle(cardSymbols);

    var flippedCard;
    var flipLock = false;
    var flipLocked = function() {
        return flipLock;
    };

    for(var i = 0; i < 16; i++) {
        var card = new CardView({
            content: cardSymbols[i],
            size: [cardWidth, cardHeight]
        });
        card.flipLocked = flipLocked;
        card.cardNumber = cardSymbols[i];
        card.on('flipped', function(flipped) {
            // If there is already a flipped card, prevent more flips and compare them
            if(flipped) {
                if(flippedCard) {
                    flipLock = true;
                    var that = this;
                    if(this.cardNumber === flippedCard.cardNumber) {
                        setTimeout(function() {
                            currentPlayer.score = currentPlayer.score + 1;
                            updateHeader();
                            that.removeCard();
                            flippedCard.removeCard();
                            flippedCard = undefined;
                            flipLock = false;
                        }, 1000);
                    } else {
                        // Pause and then unflip the cards
                        setTimeout(function() {
                            flippedCard.unflip();
                            that.unflip();
                            flippedCard = undefined;
                            flipLock = false;
                            switchPlayer();
                        }, 1000);
                    }
                } else {
                    flippedCard = this;
                }
            } else {
                // Unflipping a card, if it's the one in the buffer, clear it
                if(this == flippedCard) {
                    flippedCard = undefined;
                }
            }
        });
        cards.push(card);
    }

    layout.content.add(grid);

    function shuffle(array) {
        var currentIndex = array.length
            , temporaryValue
            , randomIndex
            ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function getHeaderContent(activePlayerNumber) {
        var player1String = player1.name;
        var player2String = player2.name;

        if(activePlayerNumber === 1) {
            player1String = '>' + player1String;
            player2String = '&nbsp;' + player2String;
        } else {
            player2String = '>' + player2String;
            player1String = '&nbsp;' + player1String;
        }
        return player1String + ': ' + player1.score + '&nbsp;&nbsp;' + player2String + ': ' + player2.score;
    }

    function switchPlayer() {
        if(currentPlayer === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
        updateHeader();
    }

    function updateHeader() {
        headerSurface.setContent(getHeaderContent(currentPlayer.playerNumber));
    }
});
