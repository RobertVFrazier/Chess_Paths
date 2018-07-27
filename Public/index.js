'use strict';

/******************************************************** 
 All global variables here. 
********************************************************/

const STORE = {  // All the variables connected with the state of the DOM go here.
    currentView: 'splash',
    previousView: 'none',
    moves: [],
    redo: [],
    scoreMoves: 0,
    scoreSquares: 0,
    targetMoves: 14,
    targetSquares: 64,
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
    },

    movesHtml: function(){
        // console.log('In the movesHtml method.');
        let pageMovesHtml=
        $('div.js-pageViewInstructionsHtml').html(pageMovesHtml);
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
        }else if(STORE.currentView==='moves'){
            this.movesPage();
        }
   },

    showCurrentPage: function(pageToShow){
        // console.log('In the showCurrentPage method.');
        $('div.js-pageViewSplashHtml').hide();
        $('div.js-pageViewInfoHtml').hide();
        $('div.js-pageViewGameBoardHtml').hide();
        $('div.js-pageViewRulesHtml').hide();
        $('div.js-pageViewMovesHtml').hide();
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
        $('.scoreTableMovesDone').html(`${STORE.scoreMoves}`);
        $('.scoreTableSquaresDone').html(`${STORE.scoreSquares}`);
        $('.scoreTableMovesToDo').html(`${STORE.targetMoves}`);
        $('.scoreTableSquaresToDo').html(`${STORE.targetSquares}`);
    },

    rulesPage: function(){
        // console.log('In the rulesPage method.');
        this.showCurrentPage('div.js-pageViewRulesHtml');
        $('.js-backButtonRulesPage').focus();
    },

    movesPage: function(){
        // console.log('In the movesPage method.');
        this.showCurrentPage('div.js-pageViewMovesHtml');
        $('.js-backButtonMovesPage').focus();
    }
};

/******************************************************************** 
Step 1c: Deal with the effects of selecting a square on the board. 
*********************************************************************/

const processSquare={
    doSquare: function(selectedSquare){  // Lower left square -> selectedSquare = 'A1'
        // console.log('In the doSquare method.');
        let legalMoveString='';
        if(STORE.moves.length>0){
            let previousSquare=STORE.moves[STORE.moves.length-1];
            legalMoveString=this.testLegal(previousSquare, selectedSquare);
            if(legalMoveString!==''){
                this.removePiece(previousSquare);
            }
        }
        if(STORE.moves.length===0){
            this.placePiece(selectedSquare);
            STORE.moves.push(selectedSquare);
            if(STORE.moves.length>STORE.redo.length>0){
                STORE.redo.push(selectedSquare);
            };
            for(let i=0; i<STORE.moves.length; i++){
                if(STORE.moves[i]!==STORE.redo[i]){
                    STORE.redo=[...STORE.moves];
                    break;
                }
            }
            this.updateScoreBoard(0, 1);
        }else if(legalMoveString!==''){
            let previousSquare=STORE.moves[STORE.moves.length-1];
            if(legalMoveString==='H'){   // horizontal move
                let oldColNum=previousSquare.substring(0,1).charCodeAt(0)-64;
                let newColNum=selectedSquare.substring(0,1).charCodeAt(0)-64;
                let RowNum=parseInt(previousSquare.substring(1), 10);
                if(newColNum>oldColNum){ // right
                    for(let i=1; i<(newColNum-oldColNum); i++){
                        let betweenSquare=String.fromCharCode(64+oldColNum+i)+(RowNum);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains("visited")===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains("visited")===false ? 1 : 0);
                }else if(newColNum<oldColNum){ // left
                    for(let i=1; i<(oldColNum-newColNum); i++){  
                        let betweenSquare=String.fromCharCode(64+oldColNum-i)+(RowNum);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains("visited")===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains("visited")===false ? 1 : 0);
                }
            }else if(legalMoveString==='V'){   // vertical move
                let oldRowNum=parseInt(previousSquare.substring(1), 10);
                let newRowNum=parseInt(selectedSquare.substring(1), 10);
                let ColNum=previousSquare.substring(0,1).charCodeAt(0)-64;
                if(newRowNum>oldRowNum){ // up
                    for(let i=1; i<(newRowNum-oldRowNum); i++){
                        let betweenSquare=String.fromCharCode(64+ColNum)+(oldRowNum+i);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains("visited")===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains("visited")===false ? 1 : 0);
                }else if(newRowNum<oldRowNum){ // down
                    for(let i=1; i<(oldRowNum-newRowNum); i++){  
                        let betweenSquare=String.fromCharCode(64+ColNum)+(oldRowNum-i);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains("visited")===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains("visited")===false ? 1 : 0);
                }
            }else if(legalMoveString==='D'){   // diagonal move
                let oldColNum=previousSquare.substring(0,1).charCodeAt(0)-64;
                let oldRowNum=parseInt(previousSquare.substring(1), 10);
                let newColNum=selectedSquare.substring(0,1).charCodeAt(0)-64;
                let newRowNum=parseInt(selectedSquare.substring(1), 10);
                if(newColNum>oldColNum && newRowNum>oldRowNum){ // up and right
                    for(let i=1; i<(newColNum-oldColNum); i++){
                        let betweenSquare=String.fromCharCode(64+oldColNum+i)+(oldRowNum+i);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains("visited")===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains("visited")===false ? 1 : 0);
                }else if(newColNum>oldColNum && newRowNum<oldRowNum){ // down and right
                    for(let i=1; i<(newColNum-oldColNum); i++){
                        let betweenSquare=String.fromCharCode(64+oldColNum+i)+(oldRowNum-i);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains("visited")===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains("visited")===false ? 1 : 0);
                }else if(newColNum<oldColNum && newRowNum<oldRowNum){ // down and left
                    for(let i=1; i<(oldColNum-newColNum); i++){
                        let betweenSquare=String.fromCharCode(64+oldColNum-i)+(oldRowNum-i);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains("visited")===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains("visited")===false ? 1 : 0);
                }else if(newColNum<oldColNum && newRowNum>oldRowNum){ // up and left
                    for(let i=1; i<(oldColNum-newColNum); i++){
                        let betweenSquare=String.fromCharCode(64+oldColNum-i)+(oldRowNum+i);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains("visited")===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains("visited")===false ? 1 : 0);
                }
            }
            this.placePiece(selectedSquare);
            STORE.moves.push(selectedSquare);
            if(STORE.moves.length>STORE.redo.length>0){
                STORE.redo.push(selectedSquare);
            };
            for(let i=0; i<STORE.moves.length; i++){
                if(STORE.moves[i]!==STORE.redo[i]){
                    STORE.redo=[...STORE.moves];
                    break;
                }
            }
        }
    },

    testLegal(currentSquare, proposedSquare){  // Determines if a proposed move is legal.
        // console.log('In the testLegal method.');
        let oldColNum=currentSquare.substring(0,1).charCodeAt(0)-64;
        let oldRowNum=parseInt(currentSquare.substring(1), 10);
        let newColNum=proposedSquare.substring(0,1).charCodeAt(0)-64;
        let newRowNum=parseInt(proposedSquare.substring(1), 10);
        let legalHorizonal=(oldColNum!==newColNum && oldRowNum===newRowNum) ? 'H' : '';
        let legalVertical=(oldColNum===newColNum && oldRowNum!==newRowNum) ? 'V' : '';
        let legalDiagonal=(Math.abs(oldColNum-newColNum)===Math.abs(oldRowNum-newRowNum)) ? 'D' : '';
        return(legalHorizonal+legalVertical+legalDiagonal);
    },

    visitSquare(visitedSquare){  // Adds a yellow overlay to a square. Maybe more code later.
        // console.log('In the visitSquare method.');
        $('.js-'+visitedSquare).addClass("visited");
        // console.log(`Square ${visitedSquare} was visited.`);
    },

    placePiece(landedSquare){  // Adds a yellow overlay with chess piece on top.
        // console.log('In the placePiece method.');
        $('.js-'+landedSquare).addClass("visited");
        $('.js-'+landedSquare).addClass("occupied");
    },

    removePiece(vacatedSquare){  // Removes chess piece, leaving yellow overlay.
        // console.log('In the removePiece method.');
        $('.js-'+vacatedSquare).removeClass("occupied");
    },

    updateScoreBoard(movesincr, squaresincr){
        // console.log('In the updateScoreBoard method.');
        STORE.scoreMoves=STORE.scoreMoves+movesincr;
        STORE.scoreSquares=STORE.scoreSquares+squaresincr;
        $('.scoreTableMovesDone').html(`${STORE.scoreMoves}`);
        $('.scoreTableMovesToDo').html(`${STORE.targetMoves-STORE.scoreMoves}`);
        $('.scoreTableSquaresDone').html(`${STORE.scoreSquares}`);
        $('.scoreTableSquaresToDo').html(`${STORE.targetSquares-STORE.scoreSquares}`);
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
        this.handleMovesButton();
        this.handleResetButton();
        this.handleUndoButton();
        this.handleRedoButton();
        this.handleLoadSaveButton();
        this.handleBackButtonInfoPage();
        this.handleBackButtonGamePage();
        this.handlebackButtonRulesPage();
        this.handlebackButtonMovesPage();
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

    handleMovesButton: function(){
        // console.log('In the handleMovesButton method.');
        $('.js-movesButton').on('click', function() {
            STORE.currentView='moves';
            STORE.previousView='rules';
            renderPage.doShowPages();
        });
    },

    handleResetButton: function(){
        // console.log('In the handleResetButton method.');
        $('.js-resetButton').on('click', function() {
            STORE.moves=[];
            STORE.redo=[];
            STORE.scoreMoves=0;
            STORE.scoreSquares=0;
            STORE.targetMoves=14;
            STORE.targetSquares=64;
            for(let i=1; i<9; i++){
                for(let j=1; j<9; j++){
                    let resetSquare=String.fromCharCode(64+i)+(j);
                    $('.js-'+resetSquare).removeClass("visited");
                    $('.js-'+resetSquare).removeClass("occupied");
                }
            }
            $('.scoreTableMovesDone').html(`${STORE.scoreMoves}`);
            $('.scoreTableMovesToDo').html(`${STORE.targetMoves-STORE.scoreMoves}`);
            $('.scoreTableSquaresDone').html(`${STORE.scoreSquares}`);
            $('.scoreTableSquaresToDo').html(`${STORE.targetSquares-STORE.scoreSquares}`);
        });
    },

    handleUndoButton: function(){
        // console.log('In the handleUndoButton method.');
        $('.js-undoButton').on('click', function() {
            STORE.moves.pop();
            let recording=STORE.moves; // Cannot use STORE.moves in the second loop; it becomes endless.
            STORE.moves=[];
            STORE.scoreMoves=0;
            STORE.scoreSquares=0;
            STORE.targetMoves=14;
            STORE.targetSquares=64;
            for(let i=1; i<9; i++){
                for(let j=1; j<9; j++){
                    let resetSquare=String.fromCharCode(64+i)+(j);
                    $('.js-'+resetSquare).removeClass("visited");
                    $('.js-'+resetSquare).removeClass("occupied");
                }
            }
            for(let i=0; i<recording.length; i++){
                processSquare.doSquare(recording[i]);
            }
            $('.scoreTableMovesDone').html(`${STORE.scoreMoves}`);
            $('.scoreTableMovesToDo').html(`${STORE.targetMoves-STORE.scoreMoves}`);
            $('.scoreTableSquaresDone').html(`${STORE.scoreSquares}`);
            $('.scoreTableSquaresToDo').html(`${STORE.targetSquares-STORE.scoreSquares}`);
        });
    },

    handleRedoButton: function(){
        // console.log('In the handleRedoButton method.');
        $('.js-redoButton').on('click', function() {
            for(let i=STORE.moves.length; i<STORE.redo.length; i++){
                processSquare.doSquare(STORE.redo[i]);
                break;
            }
            $('.scoreTableMovesDone').html(`${STORE.scoreMoves}`);
            $('.scoreTableMovesToDo').html(`${STORE.targetMoves-STORE.scoreMoves}`);
            $('.scoreTableSquaresDone').html(`${STORE.scoreSquares}`);
            $('.scoreTableSquaresToDo').html(`${STORE.targetSquares-STORE.scoreSquares}`);
        });
    },

    handleLoadSaveButton: function(){
        // console.log('In the handleLoadSaveButton method.');
        $('.js-loadSaveButton').on('click', function() {
            console.log('load/save clicked');
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

    handlebackButtonMovesPage: function(){
        // console.log('In the handlebackButtonMovesPage method.');
        $('.js-backButtonMovesPage').on('click', function() {
            STORE.currentView='rules';
            STORE.previousView='moves';
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

// const getGameData={
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