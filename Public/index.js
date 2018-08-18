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
    activeUser: '',
    newSession: true,
    jwt: '',
    showLegalMoves: false  // Not an MVP feature.
  };

/******************************************************** 
Step 1: Render the DOM. 
********************************************************/

/******************************************************** 
Step 1a: Generate the HTML code. 
********************************************************/

const generateHtml={
    doHtmlPages(){
        // console.log('In the doHtmlPages method.');
        this.splashHtml();
    },

    splashHtml(){
        // console.log('In the splashHtml method.');
        let pageSplashHtml=
        $('div.js-pageViewSplashHtml').html(pageSplashHtml);
        $('div.js-pageViewSplashHtml').hide();
    },

    gameHtml(){
        // console.log('In the gameHtml method.');
        let pageGameHtml=
        $('div.js-pageViewGameBoardHtml').html(pageGameHtml);
        $('div.js-pageViewGameBoardHtml').hide();
    },

    infoHtml(){
        // console.log('In the infoHtml method.');
        let pageInfoHtml=
        $('div.js-pageViewInstructionsHtml').html(pageInfoHtml);
        $('div.js-pageViewInstructionsHtml').hide();
    },

    rulesHtml(){
        // console.log('In the rulesHtml method.');
        let pageRulesHtml=
        $('div.js-pageViewInstructionsHtml').html(pageRulesHtml);
        $('div.js-pageViewInstructionsHtml').hide();
    },

    movesHtml(){
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
   doShowPages(){
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
        }else if(STORE.currentView==='saves'){
            this.savesPage();
        }else if(STORE.currentView==='credentials'){
            this.credentialsPage();
        }
   },

    showCurrentPage(pageToShow){
        // console.log('In the showCurrentPage method.');
        $('div.js-pageViewSplashHtml').hide();
        $('div.js-pageViewInfoHtml').hide();
        $('div.js-pageViewGameBoardHtml').hide();
        $('div.js-pageViewRulesHtml').hide();
        $('div.js-pageViewMovesHtml').hide();
        $('div.js-pageViewSavesHtml').hide();
        $('div.js-pageViewCredentialsHtml').hide();
        $(pageToShow).show();
    },

    splashPage(){
        // console.log('In the splashPage method.');
        this.showCurrentPage('div.js-pageViewSplashHtml');
        if(STORE.previousView==='info'){
            $('.js-infoButton').focus();
        }else if(STORE.previousView==='game'){
            $('.js-queenButton').focus();
        }
    },

    infoPage(){
        // console.log('In the infoPage method.');
        this.showCurrentPage('div.js-pageViewInfoHtml');
        $('.js-backButtonInfoPage').focus();
    },

    gamePage(){
        // console.log('In the gamePage method.');
        this.showCurrentPage('div.js-pageViewGameBoardHtml');
        $('.js-backButtonGamePage').focus();
        $('.scoreTableMovesDone').html(`${STORE.scoreMoves}`);
        $('.scoreTableSquaresDone').html(`${STORE.scoreSquares}`);
        $('.scoreTableMovesToDo').html(`${STORE.targetMoves}`);
        $('.scoreTableSquaresToDo').html(`${STORE.targetSquares}`);
        if(STORE.moves.length===0){
            $('.js-undoButton').prop("disabled",true).css('cursor','not-allowed');
            $('.js-undoButton img').attr('src','Images/Buttons/Undo_Grey_Button.png');
            $('.js-redoButton').prop("disabled",true).css('cursor','not-allowed');
            $('.js-redoButton img').attr('src','Images/Buttons/Redo_Grey_Button.png');
            $('.js-resetButton').prop("disabled",true).css('cursor','not-allowed');
            $('.js-resetButton img').attr('src','Images/Buttons/Reset_Grey_Button.png');
        };
    },

    rulesPage(){
        // console.log('In the rulesPage method.');
        this.showCurrentPage('div.js-pageViewRulesHtml');
        $('.js-backButtonRulesPage').focus();
    },

    movesPage(){
        // console.log('In the movesPage method.');
        this.showCurrentPage('div.js-pageViewMovesHtml');
        $('.js-backButtonMovesPage').focus();
    },

    savesPage(){
        // console.log('In the savesPage method.');
        this.showCurrentPage('div.js-pageViewSavesHtml');
        if(STORE.newSession===true && localStorage.getItem('jwt')!==''){
            console.log(localStorage.getItem('jwt'));
            fetch('/api/protected',{
                method:'GET',
                headers: {Authorization: `Bearer ${localStorage.getItem('jwt')}`}
            }).then(data=>data.json().then(user=>{
                STORE.activeUser=user.user;
                STORE.newSession=false;
                STORE.currentView='saves';
                STORE.previousView='game';
                renderPage.doShowPages();
            }));
        };
        if(STORE.activeUser===''){
            $('.js-logInNavButton').show();
            $('.js-signUpNavButton').show();
            $('.js-logOutNavButton').hide();
            $('.js-saveGameButton').prop("disabled",true).css('cursor','not-allowed');
            $('.js-saveGameButton img').attr('src','Images/Buttons/Save_Game_Grey_Button.png');
            $('.js-loadGameButton').prop("disabled",true).css('cursor','not-allowed');
            $('.js-loadGameButton img').attr('src','Images/Buttons/Load_Game_Grey_Button.png');
            $('.js-replaceGameButton').prop("disabled",true).css('cursor','not-allowed');
            $('.js-replaceGameButton img').attr('src','Images/Buttons/Replace_Game_Grey_Button.png');
            $('.js-deleteGameButton').prop("disabled",true).css('cursor','not-allowed');
            $('.js-deleteGameButton img').attr('src','Images/Buttons/Delete_Game_Grey_Button.png');
            if(localStorage.getItem('jwt')===''){
                $('.js-logInNavButton').prop("disabled",true).css('cursor','not-allowed');
                $('.js-logInNavButton img').attr('src','Images/Buttons/Log_In_Grey_Button.png');
            }else{
                $('.js-logInNavButton').prop("disabled",false).css('cursor','pointer');
                $('.js-logInNavButton img').attr('src','Images/Buttons/Log_In_Button.png');};
        }else{
            $('.js-logInNavButton').hide();
            $('.js-signUpNavButton').hide();
            $('.js-logOutNavButton').show();
            if(STORE.moves.length>0){
                $('.js-saveGameButton').prop("disabled",false).css('cursor','pointer');
                $('.js-saveGameButton img').attr('src','Images/Buttons/Save_Game_Button.png');
            }else{
                $('.js-saveGameButton').prop("disabled",true).css('cursor','not-allowed');
                $('.js-saveGameButton img').attr('src','Images/Buttons/Save_Game_Grey_Button.png');
            };
            if(true){  // Test for existing saved game data for this user goes here.
                $('.js-loadGameButton').prop("disabled",false).css('cursor','pointer');
                $('.js-loadGameButton img').attr('src','Images/Buttons/Load_Game_Button.png');
            }else{
                $('.js-loadGameButton').prop("disabled",true).css('cursor','not-allowed');
                $('.js-loadGameButton img').attr('src','Images/Buttons/Load_Game_Grey_Button.png');
            };
            if(STORE.moves.length>0){  // && test for existing saved game data for this user goes here.
                $('.js-replaceGameButton').prop("disabled",false).css('cursor','pointer');
                $('.js-replaceGameButton img').attr('src','Images/Buttons/Replace_Game_Button.png');
            }else{
                $('.js-replaceGameButton').prop("disabled",true).css('cursor','not-allowed');
                $('.js-replaceGameButton img').attr('src','Images/Buttons/Replace_Game_Grey_Button.png');
            };
            if(true){  // Test for existing saved game data for this user goes here.
                $('.js-deleteGameButton').prop("disabled",false).css('cursor','pointer');
                $('.js-deleteGameButton img').attr('src','Images/Buttons/Delete_Game_Button.png');
            }else{
                $('.js-deleteGameButton').prop("disabled",true).css('cursor','not-allowed');
                $('.js-deleteGameButton img').attr('src','Images/Buttons/Delete_Game_Grey_Button.png');
            };
        };
        $('.js-savedGamesUserName').text(STORE.activeUser);
        $('.js-backButtonSavesPage').focus();
    },

    credentialsPage(){
        // console.log('In the credentialsPage method.');
        this.showCurrentPage('div.js-pageViewCredentialsHtml');
        $('.js-backButtonCredentialsPage').focus();
    }
};

/******************************************************************** 
Step 1c: Deal with the effects of selecting a square on the board. 
*********************************************************************/

const processSquare={
    doSquare(selectedSquare){  // Lower left square -> selectedSquare = 'A1'
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
                };
            };
            $('.js-undoButton').prop("disabled",false).css('cursor','pointer');
            $('.js-undoButton img').attr('src','Images/Buttons/Undo_Button.png');
            $('.js-resetButton').prop("disabled",false).css('cursor','pointer');
            $('.js-resetButton img').attr('src','Images/Buttons/Reset_Button.png');
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
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains('visited')===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains('visited')===false ? 1 : 0);
                }else if(newColNum<oldColNum){ // left
                    for(let i=1; i<(oldColNum-newColNum); i++){  
                        let betweenSquare=String.fromCharCode(64+oldColNum-i)+(RowNum);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains('visited')===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains('visited')===false ? 1 : 0);
                }
            }else if(legalMoveString==='V'){   // vertical move
                let oldRowNum=parseInt(previousSquare.substring(1), 10);
                let newRowNum=parseInt(selectedSquare.substring(1), 10);
                let ColNum=previousSquare.substring(0,1).charCodeAt(0)-64;
                if(newRowNum>oldRowNum){ // up
                    for(let i=1; i<(newRowNum-oldRowNum); i++){
                        let betweenSquare=String.fromCharCode(64+ColNum)+(oldRowNum+i);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains('visited')===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains('visited')===false ? 1 : 0);
                }else if(newRowNum<oldRowNum){ // down
                    for(let i=1; i<(oldRowNum-newRowNum); i++){  
                        let betweenSquare=String.fromCharCode(64+ColNum)+(oldRowNum-i);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains('visited')===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains('visited')===false ? 1 : 0);
                }
            }else if(legalMoveString==='D'){   // diagonal move
                let oldColNum=previousSquare.substring(0,1).charCodeAt(0)-64;
                let oldRowNum=parseInt(previousSquare.substring(1), 10);
                let newColNum=selectedSquare.substring(0,1).charCodeAt(0)-64;
                let newRowNum=parseInt(selectedSquare.substring(1), 10);
                if(newColNum>oldColNum && newRowNum>oldRowNum){ // up and right
                    for(let i=1; i<(newColNum-oldColNum); i++){
                        let betweenSquare=String.fromCharCode(64+oldColNum+i)+(oldRowNum+i);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains('visited')===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains('visited')===false ? 1 : 0);
                }else if(newColNum>oldColNum && newRowNum<oldRowNum){ // down and right
                    for(let i=1; i<(newColNum-oldColNum); i++){
                        let betweenSquare=String.fromCharCode(64+oldColNum+i)+(oldRowNum-i);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains('visited')===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains('visited')===false ? 1 : 0);
                }else if(newColNum<oldColNum && newRowNum<oldRowNum){ // down and left
                    for(let i=1; i<(oldColNum-newColNum); i++){
                        let betweenSquare=String.fromCharCode(64+oldColNum-i)+(oldRowNum-i);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains('visited')===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains('visited')===false ? 1 : 0);
                }else if(newColNum<oldColNum && newRowNum>oldRowNum){ // up and left
                    for(let i=1; i<(oldColNum-newColNum); i++){
                        let betweenSquare=String.fromCharCode(64+oldColNum-i)+(oldRowNum+i);
                        if(document.querySelector(`.js-${betweenSquare}`).classList.contains('visited')===false){
                            STORE.scoreSquares++;
                            this.visitSquare(betweenSquare);
                        }
                    }
                    this.updateScoreBoard(1, document.querySelector(`.js-${selectedSquare}`).classList.contains('visited')===false ? 1 : 0);
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
        };
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
        $('.js-'+visitedSquare).addClass('visited');
        // console.log(`Square ${visitedSquare} was visited.`);
    },

    placePiece(landedSquare){  // Adds a yellow overlay with chess piece on top.
        // console.log('In the placePiece method.');
        $('.js-'+landedSquare).addClass('visited');
        $('.js-'+landedSquare).addClass('occupied');
    },

    removePiece(vacatedSquare){  // Removes chess piece, leaving yellow overlay.
        // console.log('In the removePiece method.');
        $('.js-'+vacatedSquare).removeClass('occupied');
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

/******************************************************************** 
Step 1d: Deal with save game actions. 
*********************************************************************/

const processSavedGames={
    doSavedGames(action){
        if(action==='save'){
            this.saveGame();
        }else if(action==='load'){
            this.loadGame();
        }else if(action==='replace'){
            this.replaceGame();
        }else if(action==='delete'){
            this.deleteGame();
        }
    },

    saveGame(){  
        // console.log('In the saveGame method.');
        console.log('This will be the save game function.');
    },

    loadGame(){  
        // console.log('In the loadGame method.');
        console.log('This will be the load game function.');
    },

    replaceGame(){
        // console.log('In the replaceGame method.');
        console.log('This will be the replace game function.');
    },

    deleteGame(){  
        // console.log('In the deleteGame method.');
        console.log('This will be the delete game function.');
    }
};

/******************************************************************** 
Step 1e: Deal with authenticating a user.
*********************************************************************/

const processCredentials={
    doCredentials(action){
        if(action==='signUp'){
            this.userSignUp();
        }else if(action==='logIn'){
            this.userLogIn();
        }
    },

    userSignUp(){
        // console.log('In the userSignUp method.');
        let credentialsUser=$('#username').val();
        let credentialsPassword=$('#password').val();
        let data={user:credentialsUser,password:credentialsPassword};
        fetch('/api/users',{
            method: 'POST',
            body: JSON.stringify(data),
            headers:{'Content-Type': 'application/json'}
        }).then(res=>res.json())
        .catch(error=>console.error('Error:', error))
        .then(response=>{
            console.log('Success:', response);
            STORE.activeUser=response.user;
            this.doLogIn(credentialsUser,credentialsPassword);
        });
    },

    userLogIn(){
        // console.log('In the userLogIn method.');
        let credentialsUser=$('#username').val();
        let credentialsPassword=$('#password').val();
        this.doLogIn(credentialsUser,credentialsPassword);
    },

    doLogIn(parmUser,parmPassword){
        // console.log('In the doLogIn method.');
        let data={user:parmUser,password:parmPassword};
        fetch('/api/auth/login',{
            method: 'POST',
            body: JSON.stringify(data),
            headers:{'Content-Type': 'application/json'}
        }).then(res=>res.json())
        .catch(error=>console.error('Error:', error))
        .then(response=>{
            console.log('Success:', response.authToken);
            localStorage.setItem('jwt',response.authToken);
            STORE.activeUser=parmUser;
            STORE.currentView='saves';
            STORE.previousView='credentials';
            renderPage.doShowPages();
        });
    }
};

/******************************************************** 
 * Step 2: Listen for user interactions.
 ********************************************************/

const listeners={
    listen(){
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
        this.handleBackButtonRulesPage();
        this.handleBackButtonMovesPage();
        this.handleBackButtonSavesPage();
        this.handleSignUpNavButton();
        this.handleLogInNavButton();
        this.handleLogOutNavButton();
        this.handleSaveButton();
        this.handleLoadButton();
        this.handleUpdateButton();
        this.handleDeleteButton();
        this.handleBackButtonCredentialsPage();
        this.handleFormSignUpButton();
        this.handleFormLogInButton();
        this.handleSquare();
        this.handleSubmit();
    },

    handleInfoButton(){
        // console.log('In the handleInfoButton method.');
        $('.js-infoButton').on('click', function() {
            STORE.currentView='info';
            STORE.previousView='splash';
            renderPage.doShowPages();
        });
    },

    handleQueenButton(){
        // console.log('In the handleQueenButton method.');
        $('.js-queenButton').on('click', function() {
            STORE.currentView='game';
            STORE.previousView='splash';
            renderPage.doShowPages();
        });
    },

    handleRulesButton(){
        // console.log('In the handleRulesButton method.');
        $('.js-rulesButton').on('click', function() {
            STORE.currentView='rules';
            STORE.previousView='game';
            renderPage.doShowPages();
        });
    },

    handleMovesButton(){
        // console.log('In the handleMovesButton method.');
        $('.js-movesButton').on('click', function() {
            STORE.currentView='moves';
            STORE.previousView='rules';
            renderPage.doShowPages();
        });
    },

    handleResetButton(){
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
                    $('.js-'+resetSquare).removeClass('visited');
                    $('.js-'+resetSquare).removeClass('occupied');
                }
            }
            $('.scoreTableMovesDone').html(`${STORE.scoreMoves}`);
            $('.scoreTableMovesToDo').html(`${STORE.targetMoves-STORE.scoreMoves}`);
            $('.scoreTableSquaresDone').html(`${STORE.scoreSquares}`);
            $('.scoreTableSquaresToDo').html(`${STORE.targetSquares-STORE.scoreSquares}`);
            $('.js-undoButton').prop("disabled",true).css('cursor','not-allowed');
            $('.js-undoButton img').attr('src','Images/Buttons/Undo_Grey_Button.png');
            $('.js-redoButton').prop("disabled",true).css('cursor','not-allowed');
            $('.js-redoButton img').attr('src','Images/Buttons/Redo_Grey_Button.png');
            $('.js-resetButton').prop("disabled",true).css('cursor','not-allowed');
            $('.js-resetButton img').attr('src','Images/Buttons/Reset_Grey_Button.png');
        });
    },

    handleUndoButton(){
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
                    $('.js-'+resetSquare).removeClass('visited');
                    $('.js-'+resetSquare).removeClass('occupied');
                }
            }
            for(let i=0; i<recording.length; i++){
                processSquare.doSquare(recording[i]);
            }
            if(STORE.moves.length===0){
                $('.js-undoButton').prop("disabled",true).css('cursor','not-allowed');
                $('.js-undoButton img').attr('src','Images/Buttons/Undo_Grey_Button.png');
            };
            if(STORE.moves.length<STORE.redo.length){
                $('.js-redoButton').prop("disabled",false).css('cursor','pointer');
                $('.js-redoButton img').attr('src','Images/Buttons/Redo_Button.png');
            };
            $('.scoreTableMovesDone').html(`${STORE.scoreMoves}`);
            $('.scoreTableMovesToDo').html(`${STORE.targetMoves-STORE.scoreMoves}`);
            $('.scoreTableSquaresDone').html(`${STORE.scoreSquares}`);
            $('.scoreTableSquaresToDo').html(`${STORE.targetSquares-STORE.scoreSquares}`);
        });
    },

    handleRedoButton(){
        // console.log('In the handleRedoButton method.');
        $('.js-redoButton').on('click', function() {
            for(let i=STORE.moves.length; i<STORE.redo.length; i++){
                processSquare.doSquare(STORE.redo[i]);
                if(STORE.moves.length===STORE.redo.length){
                    $('.js-redoButton').prop("disabled",true).css('cursor','not-allowed');
                    $('.js-redoButton img').attr('src','Images/Buttons/Redo_Grey_Button.png');
                };
                if(STORE.moves.length>0){
                    $('.js-undoButton').prop("disabled",false).css('cursor','pointer');
                    $('.js-undoButton img').attr('src','Images/Buttons/Undo_Button.png');
                };
                break;
            }
            $('.scoreTableMovesDone').html(`${STORE.scoreMoves}`);
            $('.scoreTableMovesToDo').html(`${STORE.targetMoves-STORE.scoreMoves}`);
            $('.scoreTableSquaresDone').html(`${STORE.scoreSquares}`);
            $('.scoreTableSquaresToDo').html(`${STORE.targetSquares-STORE.scoreSquares}`);
        });
    },

    handleLoadSaveButton(){
        // console.log('In the handleLoadSaveButton method.');
        $('.js-loadSaveButton').on('click', function() {
            STORE.currentView='saves';
            STORE.previousView='game';
            renderPage.doShowPages();
        });
    },

    handleBackButtonInfoPage(){
        // console.log('In the handleBackButtonInfoPage method.');
        $('.js-backButtonInfoPage').on('click', function() {
            STORE.currentView='splash';
            STORE.previousView='info';
            renderPage.doShowPages();
        });
    },

    handleBackButtonGamePage(){
        // console.log('In the handleBackButtonGamePage method.');
        $('.js-backButtonGamePage').on('click', function() {
            STORE.currentView='splash';
            STORE.previousView='game';
            renderPage.doShowPages();
        });
    },

    handleBackButtonRulesPage(){
        // console.log('In the handleBackButtonRulesPage method.');
        $('.js-backButtonRulesPage').on('click', function() {
            STORE.currentView='game';
            STORE.previousView='rules';
            renderPage.doShowPages();
        });
    },

    handleBackButtonMovesPage(){
        // console.log('In the handleBackButtonMovesPage method.');
        $('.js-backButtonMovesPage').on('click', function() {
            STORE.currentView='rules';
            STORE.previousView='moves';
            renderPage.doShowPages();
        });
    },

    handleBackButtonSavesPage(){
        // console.log('In the handleBackButtonSavesPage method.');
        $('.js-backButtonSavesPage').on('click', function() {
            STORE.currentView='game';
            STORE.previousView='saves';
            renderPage.doShowPages();
        });
    },

    handleSignUpNavButton(){
        // console.log('In the handleSignUpNavButton method.');
        $('.js-signUpNavButton').on('click', function() {
            $('.js-formSignUpButton').show();
            $('.js-formLogInButton').hide();
            $('.js-fieldsTitle').text('Sign Up');
            STORE.currentView='credentials';
            STORE.previousView='saves';
            renderPage.doShowPages();
        });
    },

    handleLogInNavButton(){
        // console.log('In the handleLogInNavButton method.');
        $('.js-logInNavButton').on('click', function() {
            $('.js-formSignUpButton').hide();
            $('.js-formLogInButton').show();
            $('.js-fieldsTitle').text('Log In');
            STORE.currentView='credentials';
            STORE.previousView='saves';
            renderPage.doShowPages();
        });
    },

    handleLogOutNavButton(){
        // console.log('In the handleLogOutNavButton method.');
        $('.js-logOutNavButton').on('click', function() {
            STORE.activeUser='';
            STORE.currentView='saves';
            STORE.previousView='saves';
            renderPage.doShowPages();
        });
    },

    handleSaveButton(){
        // console.log('In the handleSaveButton method.');
        $('.js-saveGameButton').on('click', function() {
            console.log('Save Game button clicked');
        });
    },

    handleLoadButton(){
        // console.log('In the handleLoadButton method.');
        $('.js-loadGameButton').on('click', function() {
            console.log('Load Game button clicked');
        });
    },

    handleUpdateButton(){
        // console.log('In the handleUpdateButton method.');
        $('.js-replaceGameButton').on('click', function() {
            console.log('Replace Game button clicked');
        });
    },

    handleDeleteButton(){
        // console.log('In the handleDeleteButton method.');
        $('.js-deleteGameButton').on('click', function() {
            console.log('Delete Game button clicked');
        });
    },

    handleBackButtonCredentialsPage(){
        // console.log('In the handleBackButtonCredentialsPage method.');
        $('.js-backButtonCredentialsPage').on('click', function() {
            STORE.currentView='saves';
            STORE.previousView='credentials';
            renderPage.doShowPages();
        });
    },

    handleFormSignUpButton(){
        // console.log('In the handleFormSignUpButton method.');
        $('.js-formSignUpButton').on('click', function() {
            processCredentials.doCredentials('signUp');
        });
    },

    handleFormLogInButton(){
        // console.log('In the handleFormLogInButton method.');
        $('.js-formLogInButton').on('click', function() {
            processCredentials.doCredentials('logIn');
        });
    },

    handleSquare(){
        // console.log('In the handleSquare method.');
        $('.square').click(function() {
            let location=$(this).data('location');
            processSquare.doSquare(location);
        });
    },

    handleSubmit(){
        // console.log('In the handleSubmit method.');
        $('.credentialsForm').on('submit', function(event){
            event.preventDefault();
        });
    }
};

/******************************************************** 
 * Step 3: Get API data to match user inputs.
 ********************************************************/

const getGameData={
};

/***************************** 
 * Javascript starts here.
 ****************************/

function main(){
    // console.log('Begin the program');
    renderPage.doShowPages();
    listeners.listen();
};

$(main);