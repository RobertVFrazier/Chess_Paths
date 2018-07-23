'use strict';

/******************************************************** 
 All global variables here. 
********************************************************/

const STORE = {  // All the variables connected with the state of the DOM go here.
    currentView: 'splash',
    previousView: 'none',
    startSquare: '',
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
            legalMove=this.testLegal(selectedSquare, legalMove);
            console.log(legalMove);
            if(legalMove){
                this.removePiece(STORE.moves[STORE.moves.length-1]);
            }
        }
        if(STORE.moves.length===0 || legalMove){
            this.placePiece(selectedSquare);
            STORE.moves.push(selectedSquare);
        }
    },

    testLegal(proposedSquare, isLegal){  // Determines if a proposed move is legal.
        console.log('In the testLegal method.');
        isLegal = true;
        console.log(proposedSquare, isLegal);
        return isLegal;
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
        this.handleA1();
        this.handleA2();
        this.handleA3();
        this.handleA4();
        this.handleA5();
        this.handleA6();
        this.handleA7();
        this.handleA8();
        this.handleB1();
        this.handleB2();
        this.handleB3();
        this.handleB4();
        this.handleB5();
        this.handleB6();
        this.handleB7();
        this.handleB8();
        this.handleC1();
        this.handleC2();
        this.handleC3();
        this.handleC4();
        this.handleC5();
        this.handleC6();
        this.handleC7();
        this.handleC8();
        this.handleD1();
        this.handleD2();
        this.handleD3();
        this.handleD4();
        this.handleD5();
        this.handleD6();
        this.handleD7();
        this.handleD8();
        this.handleE1();
        this.handleE2();
        this.handleE3();
        this.handleE4();
        this.handleE5();
        this.handleE6();
        this.handleE7();
        this.handleE8();
        this.handleF1();
        this.handleF2();
        this.handleF3();
        this.handleF4();
        this.handleF5();
        this.handleF6();
        this.handleF7();
        this.handleF8();
        this.handleG1();
        this.handleG2();
        this.handleG3();
        this.handleG4();
        this.handleG5();
        this.handleG6();
        this.handleG7();
        this.handleG8();
        this.handleH1();
        this.handleH2();
        this.handleH3();
        this.handleH4();
        this.handleH5();
        this.handleH6();
        this.handleH7();
        this.handleH8();
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

    //////////////
    // COLUMN A //
    //////////////

    handleA1: function(){
        // console.log('In the handleA1 method.');
        $('.js-A1').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleA2: function(){
        // console.log('In the handleA2 method.');
        $('.js-A2').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleA3: function(){
        // console.log('In the handleA3 method.');
        $('.js-A3').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleA4: function(){
        // console.log('In the handleA4 method.');
        $('.js-A4').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleA5: function(){
        // console.log('In the handleA5 method.');
        $('.js-A5').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleA6: function(){
        // console.log('In the handleA6 method.');
        $('.js-A6').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleA7: function(){
        // console.log('In the handleA7 method.');
        $('.js-A7').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleA8: function(){
        // console.log('In the handleA8 method.');
        $('.js-A8').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    //////////////
    // COLUMN B //
    //////////////

    handleB1: function(){
        // console.log('In the handleB1 method.');
        $('.js-B1').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleB2: function(){
        // console.log('In the handleB2 method.');
        $('.js-B2').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleB3: function(){
        // console.log('In the handleB3 method.');
        $('.js-B3').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleB4: function(){
        // console.log('In the handleB4 method.');
        $('.js-B4').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleB5: function(){
        // console.log('In the handleB5 method.');
        $('.js-B5').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleB6: function(){
        // console.log('In the handleB6 method.');
        $('.js-B6').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleB7: function(){
        // console.log('In the handleB7 method.');
        $('.js-B7').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleB8: function(){
        // console.log('In the handleB8 method.');
        $('.js-B8').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    //////////////
    // COLUMN C //
    //////////////

    handleC1: function(){
        // console.log('In the handleC1 method.');
        $('.js-C1').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleC2: function(){
        // console.log('In the handleC2 method.');
        $('.js-C2').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleC3: function(){
        // console.log('In the handleC3 method.');
        $('.js-C3').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleC4: function(){
        // console.log('In the handleC4 method.');
        $('.js-C4').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleC5: function(){
        // console.log('In the handleC5 method.');
        $('.js-C5').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleC6: function(){
        // console.log('In the handleC6 method.');
        $('.js-C6').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleC7: function(){
        // console.log('In the handleC7 method.');
        $('.js-C7').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleC8: function(){
        // console.log('In the handleC8 method.');
        $('.js-C8').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    //////////////
    // COLUMN D //
    //////////////

    handleD1: function(){
        // console.log('In the handleD1 method.');
        $('.js-D1').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleD2: function(){
        // console.log('In the handleD2 method.');
        $('.js-D2').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleD3: function(){
        // console.log('In the handleD3 method.');
        $('.js-D3').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleD4: function(){
        // console.log('In the handleD4 method.');
        $('.js-D4').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleD5: function(){
        // console.log('In the handleD5 method.');
        $('.js-D5').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleD6: function(){
        // console.log('In the handleD6 method.');
        $('.js-D6').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleD7: function(){
        // console.log('In the handleD7 method.');
        $('.js-D7').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleD8: function(){
        // console.log('In the handleD8 method.');
        $('.js-D8').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    //////////////
    // COLUMN E //
    //////////////

    handleE1: function(){
        // console.log('In the handleE1 method.');
        $('.js-E1').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleE2: function(){
        // console.log('In the handleE2 method.');
        $('.js-E2').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleE3: function(){
        // console.log('In the handleE3 method.');
        $('.js-E3').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleE4: function(){
        // console.log('In the handleE4 method.');
        $('.js-E4').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleE5: function(){
        // console.log('In the handleE5 method.');
        $('.js-E5').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleE6: function(){
        // console.log('In the handleE6 method.');
        $('.js-E6').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleE7: function(){
        // console.log('In the handleE7 method.');
        $('.js-E7').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleE8: function(){
        // console.log('In the handleE8 method.');
        $('.js-E8').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    //////////////
    // COLUMN F //
    //////////////

    handleF1: function(){
        // console.log('In the handleF1 method.');
        $('.js-F1').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleF2: function(){
        // console.log('In the handleF2 method.');
        $('.js-F2').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleF3: function(){
        // console.log('In the handleF3 method.');
        $('.js-F3').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleF4: function(){
        // console.log('In the handleF4 method.');
        $('.js-F4').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleF5: function(){
        // console.log('In the handleF5 method.');
        $('.js-F5').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleF6: function(){
        // console.log('In the handleF6 method.');
        $('.js-F6').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleF7: function(){
        // console.log('In the handleF7 method.');
        $('.js-F7').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleF8: function(){
        // console.log('In the handleF8 method.');
        $('.js-F8').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    //////////////
    // COLUMN G //
    //////////////

    handleG1: function(){
        // console.log('In the handleG1 method.');
        $('.js-G1').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleG2: function(){
        // console.log('In the handleG2 method.');
        $('.js-G2').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleG3: function(){
        // console.log('In the handleG3 method.');
        $('.js-G3').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleG4: function(){
        // console.log('In the handleG4 method.');
        $('.js-G4').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleG5: function(){
        // console.log('In the handleG5 method.');
        $('.js-G5').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleG6: function(){
        // console.log('In the handleG6 method.');
        $('.js-G6').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleG7: function(){
        // console.log('In the handleG7 method.');
        $('.js-G7').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleG8: function(){
        // console.log('In the handleG8 method.');
        $('.js-G8').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    //////////////
    // COLUMN H //
    //////////////

    handleH1: function(){
        // console.log('In the handleH1 method.');
        $('.js-H1').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleH2: function(){
        // console.log('In the handleH2 method.');
        $('.js-H2').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleH3: function(){
        // console.log('In the handleH3 method.');
        $('.js-H3').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleH4: function(){
        // console.log('In the handleH4 method.');
        $('.js-H4').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleH5: function(){
        // console.log('In the handleH5 method.');
        $('.js-H5').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleH6: function(){
        // console.log('In the handleH6 method.');
        $('.js-H6').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleH7: function(){
        // console.log('In the handleH7 method.');
        $('.js-H7').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
        });
    },

    handleH8: function(){
        // console.log('In the handleH8 method.');
        $('.js-H8').on('click', function() {
            processSquare.doSquare(this.className.substring(10,12));
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