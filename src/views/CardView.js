/*** CardView ***/

// define this module in Require.JS
define(function(require, exports, module) {

    // Import additional modules to be used in this view
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');

    // Constructor function for our CardView class
    function CardView() {

        // Applies View's constructor function to CardView class
        View.apply(this, arguments);

        // Add a surface and a click event
        var card = this;

        this.rootModifier = new StateModifier({
            size: card.options.size,
            origin: [0.5, 0.5]
        });

        // saving a reference to the new node
        this.mainNode = this.add(this.rootModifier);

        var back = new Surface({
            properties: {
                backgroundColor: '#FFFFFD',
                boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.5)',
                cursor: 'pointer',
                color: 'black',
                lineHeight: card.options.size[1] / 2 + 'px',
                textAlign: 'center',
                borderRadius: '15px'
            }
        });

        var front = new Surface({
            content: card.options.content,
            properties: {
                backgroundColor: '#FFFFFD',
                boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.5)',
                cursor: 'pointer',
                color: 'black',
                lineHeight: card.options.size[1] / 2 + 'px',
                textAlign: 'center',
                borderRadius: '15px'
            }
        });

        back.on('click', function() {
            if(!card.flipLocked()) {
                card.rootModifier.setTransform(
                    Transform.rotateY(180 * (Math.PI / 180)),
                    { duration: 350, curve: 'easeInOut' }
                );

                card._eventOutput.emit('flipped', true);
            }
        });

        this.mainNode.add(back);

        this.frontNode = this.mainNode.add(new StateModifier({
            origin: [0.5, 0.5],
            transform: Transform.rotateY(180 * (Math.PI / 180))
        }));

        this.frontNode.add(front);

        this.unflip = function() {
            card.rootModifier.setTransform(
                Transform.rotateY(0),
                { duration: 350, curve: 'easeInOut' }
            );
        };

        this.removeCard = function() {
            card.rootModifier.setTransform(
                Transform.translate(0, -2000, 0),
                { duration: 500, curve: 'easeIn' }
            );
        };
    }

    // Establishes prototype chain for CardView class to inherit from View
    CardView.prototype = Object.create(View.prototype);
    CardView.prototype.constructor = CardView;

    // Default options for CardView class
    CardView.DEFAULT_OPTIONS = {
        content: 'card view'
    };

    // Define your helper functions and prototype methods here

    module.exports = CardView;
});

