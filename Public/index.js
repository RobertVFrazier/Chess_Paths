'use strict';

/******************************************************** 
 All global variables here. 
********************************************************/

const STORE = {  // All the variables connected with the state of the DOM go here.
    currentView: 'splash',
    previousView: 'none',
    moves: [],
    redo: [],
    showLegalMoves: false  // Not an MVP feature.
  };

/******************************************************** 
Step 1: Render the DOM. 
********************************************************/

/******************************************************** 
Step 1a: Generate the HTML code. 
********************************************************/

const generateHtml={
    doHtmlPages: function(){
        // console.log('In the doHtmlPages method.');
        this.splashHtml();
    },

    splashHtml: function(){
        // console.log('In the splashHtml method.');
        let pageSplashHtml=
        $('div.js-pageViewSplashHtml').html(pageSplashHtml);
        $('div.js-pageViewSplashHtml').hide();
    },

    gameHtml: function(){
        // console.log('In the gameHtml method.');
        let pageGameHtml=
        $('div.js-pageViewGameBoardHtml').html(pageGameHtml);
        $('div.js-pageViewGameBoardHtml').hide();
    },

    infoHtml: function(){
        // console.log('In the infoHtml method.');
        let pageInfoHtml=
        $('div.js-pageViewInstructionsHtml').html(pageInfoHtml);
        $('div.js-pageViewInstructionsHtml').hide();
    },

    rulesHtml: function(){
        // console.log('In the rulesHtml method.');
        let pageRulesHtml=
        $('div.js-pageViewInstructionsHtml').html(pageRulesHtml);
        $('div.js-pageViewInstructionsHtml').hide();
    }
};

/************************************************************* 
Step 1b: Render each HTML page, based on the current state. 
**************************************************************/

const renderPage={
   doShowPages: function(){
        // console.log('In the doShowPages method.');
        if(STORE.currentView==='splash'){
            this.splashPage();
        }else if(STORE.currentView==='info'){
            this.infoPage();
        }else if(STORE.currentView==='game'){
            this.gamePage();
        }else if(STORE.currentView==='rules'){
            this.rulesPage();
        }
   },

    showCurrentPage: function(pageToShow){
        // console.log('In the showCurrentPage method.');
        $('div.js-pageViewSplashHtml').hide();
        $('div.js-pageViewInfoHtml').hide();
        $('div.js-pageViewGameBoardHtml').hide();
        $('div.js-pageViewRulesHtml').hide();
        $(pageToShow).show();
    },

    splashPage: function(){
        // console.log('In the splashPage method.');
        this.showCurrentPage('div.js-pageViewSplashHtml');
        if(STORE.previousView==='info'){
            $('.js-infoButton').focus();
        }else if(STORE.previousView==='game'){
            $('.js-queenButton').focus();
        }
    },

    infoPage: function(){
        // console.log('In the infoPage method.');
        this.showCurrentPage('div.js-pageViewInfoHtml');
        $('.js-backButtonInfoPage').focus();
    },

    gamePage: function(){
        // console.log('In the gamePage method.');
        this.showCurrentPage('div.js-pageViewGameBoardHtml');
        $('.js-backButtonGamePage').focus();
    },

    rulesPage: function(){
        // console.log('In the rulesPage method.');
        this.showCurrentPage('div.js-pageViewRulesHtml');
        $('.js-backButtonRulesPage').focus();
    }
};

/******************************************************************** 
Step 1c: Deal with the effects of selecting a square on the board. 
*********************************************************************/

const processSquare={
    doSquare: function(selectedSquare){  // Lower left square -> selectedSquare = 'A1'
        // console.log('In the doSquare method.');
        let legalMove=false;
        if(STORE.moves.length>0){
            let previousSquare=STORE.moves[STORE.moves.length-1];
            legalMove=this.testLegal(previousSquare, selectedSquare);
            if(legalMove){
                this.removePiece(previousSquare);
            }
        }
        if(STORE.moves.length===0 || legalMove){
            this.placePiece(selectedSquare);
            STORE.moves.push(selectedSquare);
        }
    },

    testLegal(currentSquare, proposedSquare){  // Determines if a proposed move is legal.
        // console.log('In the testLegal method.');
        let currentColumnNumber=currentSquare.substring(0,1).charCodeAt(0)-64;
        let currentRowNumber=parseInt(currentSquare.substring(1), 10);
        let proposedColumnNumber=proposedSquare.substring(0,1).charCodeAt(0)-64;
        let proposedRowNumber=parseInt(proposedSquare.substring(1), 10);
        let legalHorizonal=(currentColumnNumber!==proposedColumnNumber && currentRowNumber===proposedRowNumber);
        let legalVertical=(currentColumnNumber===proposedColumnNumber && currentRowNumber!==proposedRowNumber);
        let legalDiagonal=(Math.abs(currentColumnNumber-proposedColumnNumber)===Math.abs(currentRowNumber-proposedRowNumber));
        return(legalHorizonal || legalVertical || legalDiagonal);
    },

    placePiece(landedSquare){  // Adds a yellow overlay with chess piece on top.
        // console.log('In the placePiece method.');
        $('.js-'+landedSquare).addClass("visited");
        $('.js-'+landedSquare).addClass("occupied");
        // console.log(`Square ${landedSquare} was changed.`);
    },

    removePiece(vacatedSquare){  // Removes chess piece, leaving yellow overlay.
        // console.log('In the removePiece method.');
        $('.js-'+vacatedSquare).removeClass("occupied");
        // console.log(`Square ${vacatedSquare} was changed.`);
    }
};

/******************************************************** 
 * Step 2: Listen for user interactions.
 ********************************************************/

const listeners={
    listen: function(){
        // console.log('In the listen method.');
        this.handleInfoButton();
        this.handleQueenButton();
        this.handleRulesButton();
        this.handleBackButtonInfoPage();
        this.handleBackButtonGamePage();
        this.handlebackButtonRulesPage();
        this.handleSquare();
    },

    handleInfoButton: function(){
        // console.log('In the handleInfoButton method.');
        $('.js-infoButton').on('click', function() {
            STORE.currentView='info';
            STORE.previousView='splash';
            renderPage.doShowPages();
        });
    },

    handleQueenButton: function(){
        // console.log('In the handleQueenButton method.');
        $('.js-queenButton').on('click', function() {
            STORE.currentView='game';
            STORE.previousView='splash';
            renderPage.doShowPages();
        });
    },

    handleRulesButton: function(){
        // console.log('In the handleRulesButton method.');
        $('.js-rulesButton').on('click', function() {
            STORE.currentView='rules';
            STORE.previousView='game';
            renderPage.doShowPages();
        });
    },

    handleBackButtonInfoPage: function(){
        // console.log('In the handleBackButtonInfoPage method.');
        $('.js-backButtonInfoPage').on('click', function() {
            STORE.currentView='splash';
            STORE.previousView='info';
            renderPage.doShowPages();
        });
    },

    handleBackButtonGamePage: function(){
        // console.log('In the handleBackButtonGamePage method.');
        $('.js-backButtonGamePage').on('click', function() {
            STORE.currentView='splash';
            STORE.previousView='game';
            renderPage.doShowPages();
        });
    },

    handlebackButtonRulesPage: function(){
        // console.log('In the handlebackButtonRulesPage method.');
        $('.js-backButtonRulesPage').on('click', function() {
            STORE.currentView='game';
            STORE.previousView='rules';
            renderPage.doShowPages();
        });
    },

    handleSquare: function(){
        // console.log('In the handleSquare method.');
        $('.square').click(function() {
            let location=$(this).data('location');
            processSquare.doSquare(location);
        });
    }
};

/******************************************************** 
 * Step 3: Get API data to match user inputs.
 ********************************************************/

// const getFlickrPics={
// };

/***************************** 
 * Javascript starts here.
 ****************************/

function main(){
    // console.log('Begin the program');
    renderPage.doShowPages();
    listeners.listen();
};

$(main);