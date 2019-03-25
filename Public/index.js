"use strict";

/********************************************************
 All global variables here.
********************************************************/

const STORE = {
  // All the variables connected with the state of the DOM go here.
  currentView: "splash",
  previousView: "none",
  puzzle: "queen", // Future feature: add puzzles for knight, bishop, and rook.
  moves: [],
  redo: [],
  scoreMoves: 0,
  scoreSquares: 0,
  targetMoves: 14, // Future feature: other puzzles will have different victory values.
  targetSquares: 64, // Future feature: other puzzles will have different victory values.
  activeUser: "",
  newSession: true,
  jwt: "",
  savedGames: [],
  activeGame: 0,
  activeGameMoves: [],
  redrawMoves: [],
  activeSavedGameExists: false,
  showLegalMoves: false // Not an MVP feature.
};

/********************************************************
Step 1: Render the DOM.
********************************************************/

const renderPage = {
  doShowPages() {
    // console.log('In the doShowPages method.');
    if (STORE.currentView === "splash") {
      this.splashPage();
    } else if (STORE.currentView === "info") {
      this.infoPage();
    } else if (STORE.currentView === "game") {
      this.gamePage();
    } else if (STORE.currentView === "rules") {
      this.rulesPage();
    } else if (STORE.currentView === "moves") {
      this.movesPage();
    } else if (STORE.currentView === "saves") {
      this.savesPage();
    } else if (STORE.currentView === "credentials") {
      this.credentialsPage();
    }
  },

  showCurrentPage(pageToShow) {
    // console.log('In the showCurrentPage method.');
    $("div.js-pageViewSplashHtml").hide();
    $("div.js-pageViewInfoHtml").hide();
    $("div.js-pageViewGameBoardHtml").hide();
    $("div.js-pageViewRulesHtml").hide();
    $("div.js-pageViewMovesHtml").hide();
    $("div.js-pageViewSavesHtml").hide();
    $("div.js-pageViewCredentialsHtml").hide();
    $(pageToShow).show();
  },

  splashPage() {
    // console.log('In the splashPage method.');
    this.showCurrentPage("div.js-pageViewSplashHtml");
    if (STORE.previousView === "info") {
      $(".js-infoButton").focus();
    } else if (STORE.previousView === "game") {
      $(".js-queenButton").focus();
    }
    $(".hint")
      .hide()
      .delay(5000)
      .fadeIn(2000);
  },

  infoPage() {
    // console.log('In the infoPage method.');
    this.showCurrentPage("div.js-pageViewInfoHtml");
    $(".js-backButtonInfoPage").focus();
  },

  gamePage() {
    // console.log('In the gamePage method.');
    this.showCurrentPage("div.js-pageViewGameBoardHtml");
    $(".js-backButtonGamePage").focus();
    $(".scoreTableMovesDone").html(`${STORE.scoreMoves}`);
    $(".scoreTableSquaresDone").html(`${STORE.scoreSquares}`);
    $(".scoreTableMovesToDo").html(`${STORE.targetMoves}`);
    $(".scoreTableSquaresToDo").html(`${STORE.targetSquares}`);
    if (STORE.moves.length === 0) {
      $(".js-undoButton")
        .prop("disabled", true)
        .css("cursor", "not-allowed");
      $(".js-undoButton img").attr(
        "src",
        "Images/Buttons/Undo_Grey_Button.png"
      );
      $(".js-redoButton")
        .prop("disabled", true)
        .css("cursor", "not-allowed");
      $(".js-redoButton img").attr(
        "src",
        "Images/Buttons/Redo_Grey_Button.png"
      );
      $(".js-resetButton")
        .prop("disabled", true)
        .css("cursor", "not-allowed");
      $(".js-resetButton img").attr(
        "src",
        "Images/Buttons/Reset_Grey_Button.png"
      );
    }
    let htmlGameSquares = "";
    for (let j = 8; j > 0; j--) {
      for (let k = 65; k < 73; k++) {
        htmlGameSquares += `<div class='square js-${String.fromCharCode(
          k
        )}${j}' data-location='${String.fromCharCode(k)}${j}'></div>`;
      }
    }
    $(".boardContainer").html(htmlGameSquares);
    actions.do("undo");
    actions.do("redo");
  },

  rulesPage() {
    // console.log('In the rulesPage method.');
    this.showCurrentPage("div.js-pageViewRulesHtml");
    $(".fullScreen").fullScreen();
    $(".js-backButtonRulesPage").focus();
  },

  movesPage() {
    // console.log('In the movesPage method.');
    this.showCurrentPage("div.js-pageViewMovesHtml");
    $(".js-backButtonMovesPage").focus();
  },

  credentialsPage() {
    // console.log('In the credentialsPage method.');
    this.showCurrentPage("div.js-pageViewCredentialsHtml");
    $(".js-backButtonCredentialsPage").focus();
  },

  savesPage() {
    // console.log('In the savesPage method.');
    this.showCurrentPage("div.js-pageViewSavesHtml");
    if (STORE.newSession === true && localStorage.getItem("jwt") !== "") {
      // console.log(localStorage.getItem('jwt'));
      fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
      }).then(data =>
        data.json().then(user => {
          STORE.activeUser = user.user;
          STORE.newSession = false;
          STORE.currentView = "saves";
          STORE.previousView = "game";
          renderPage.doShowPages();
        })
      );
    }
    if (STORE.activeUser !== "") {
      this.fetchGameData();
    }
    this.configureGameButtons();
    $(".js-savedGamesUserName").text(STORE.activeUser);
    $(".js-backButtonSavesPage").focus();
  },

  fetchGameData() {
    let htmlGameMoves = "";
    fetch("/api/games/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
      }
    })
      .then(res => res.json())
      .catch(error => console.error("Error:", error))
      .then(response => {
        // console.log(response);
        STORE.savedGames = [];
        for (let i = 0; i < response.length; i++) {
          if (response[i].puzzle === STORE.puzzle) {
            STORE.savedGames.push({
              id: response[i]._id,
              dateTime: response[i].created,
              moves: response[i].moves[0].split(",")
            });
          }
        }
        // console.log(STORE.savedGames);
        $(".savedGamesList").html("");
        for (let i = 0; i < STORE.savedGames.length; i++) {
          htmlGameMoves = `<li data-id='${i}' class='savedGame'><div class='savedGameBoardContainer'>`;
          for (let j = 8; j > 0; j--) {
            for (let k = 65; k < 73; k++) {
              htmlGameMoves += `<div class='square js-saved-${String.fromCharCode(
                k
              )}${j}'></div>`;
            }
          }
          htmlGameMoves +=
            `</div>` +
            `<div class='dateTimeStamp'>
                    ${moment(STORE.savedGames[i].dateTime).format(
                      "MMMM DD YYYY HH:mm"
                    )}</div></li>`;
          let newElement = $(htmlGameMoves);
          STORE.redrawMoves = [];
          let currentMove = "";
          for (let j = 0; j < STORE.savedGames[i].moves.length; j++) {
            currentMove = STORE.savedGames[i].moves[j];
            actions.do("savedGame", currentMove, newElement);
          }
          $(".savedGamesList").append(newElement);
        }
        this.configureGameButtons();
      });
  },

  configureGameButtons() {
    // console.log('In the configureGameButtons method.');
    if (STORE.activeUser === "") {
      $(".js-logInNavButton").show();
      $(".js-signUpNavButton").show();
      $(".js-logOutNavButton").hide();
      $(".savedGamesList").html("");
      $(".js-saveGameButton")
        .prop("disabled", true)
        .css("cursor", "not-allowed");
      $(".js-saveGameButton img").attr(
        "src",
        "Images/Buttons/Save_Game_Grey_Button.png"
      );
      $(".js-loadGameButton")
        .prop("disabled", true)
        .css("cursor", "not-allowed");
      $(".js-loadGameButton img").attr(
        "src",
        "Images/Buttons/Load_Game_Grey_Button.png"
      );
      $(".js-replaceGameButton")
        .prop("disabled", true)
        .css("cursor", "not-allowed");
      $(".js-replaceGameButton img").attr(
        "src",
        "Images/Buttons/Replace_Game_Grey_Button.png"
      );
      $(".js-deleteGameButton")
        .prop("disabled", true)
        .css("cursor", "not-allowed");
      $(".js-deleteGameButton img").attr(
        "src",
        "Images/Buttons/Delete_Game_Grey_Button.png"
      );
      if (localStorage.getItem("jwt") === "") {
        $(".js-logInNavButton")
          .prop("disabled", true)
          .css("cursor", "not-allowed");
        $(".js-logInNavButton img").attr(
          "src",
          "Images/Buttons/Log_In_Grey_Button.png"
        );
      } else {
        $(".js-logInNavButton")
          .prop("disabled", false)
          .css("cursor", "pointer");
        $(".js-logInNavButton img").attr(
          "src",
          "Images/Buttons/Log_In_Button.png"
        );
      }
    } else {
      $(".js-logInNavButton").hide();
      $(".js-signUpNavButton").hide();
      $(".js-logOutNavButton").show();
      if (STORE.moves.length > 0) {
        $(".js-saveGameButton")
          .prop("disabled", false)
          .css("cursor", "pointer");
        $(".js-saveGameButton img").attr(
          "src",
          "Images/Buttons/Save_Game_Button.png"
        );
      } else {
        $(".js-saveGameButton")
          .prop("disabled", true)
          .css("cursor", "not-allowed");
        $(".js-saveGameButton img").attr(
          "src",
          "Images/Buttons/Save_Game_Grey_Button.png"
        );
      }
      if (
        STORE.savedGames.length > 0 &&
        STORE.activeGameMoves.length > 0 &&
        STORE.activeSavedGameExists === true
      ) {
        $(".js-loadGameButton")
          .prop("disabled", false)
          .css("cursor", "pointer");
        $(".js-loadGameButton img").attr(
          "src",
          "Images/Buttons/Load_Game_Button.png"
        );
      } else {
        $(".js-loadGameButton")
          .prop("disabled", true)
          .css("cursor", "not-allowed");
        $(".js-loadGameButton img").attr(
          "src",
          "Images/Buttons/Load_Game_Grey_Button.png"
        );
      }
      if (
        STORE.moves.length > 0 &&
        STORE.savedGames.length > 0 &&
        STORE.activeGameMoves.length > 0 &&
        STORE.activeSavedGameExists === true
      ) {
        $(".js-replaceGameButton")
          .prop("disabled", false)
          .css("cursor", "pointer");
        $(".js-replaceGameButton img").attr(
          "src",
          "Images/Buttons/Replace_Game_Button.png"
        );
      } else {
        $(".js-replaceGameButton")
          .prop("disabled", true)
          .css("cursor", "not-allowed");
        $(".js-replaceGameButton img").attr(
          "src",
          "Images/Buttons/Replace_Game_Grey_Button.png"
        );
      }
      if (
        STORE.savedGames.length > 0 &&
        STORE.activeGameMoves.length > 0 &&
        STORE.activeSavedGameExists === true
      ) {
        $(".js-deleteGameButton")
          .prop("disabled", false)
          .css("cursor", "pointer");
        $(".js-deleteGameButton img").attr(
          "src",
          "Images/Buttons/Delete_Game_Button.png"
        );
      } else {
        $(".js-deleteGameButton")
          .prop("disabled", true)
          .css("cursor", "not-allowed");
        $(".js-deleteGameButton img").attr(
          "src",
          "Images/Buttons/Delete_Game_Grey_Button.png"
        );
      }
    }
  }
};

/********************************************************
 * Step 2: Listen for user interactions.
 ********************************************************/

const listeners = {
  listen() {
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
    this.handleSavedGameListItem();
  },

  handleInfoButton() {
    // console.log('In the handleInfoButton method.');
    $(".js-infoButton").on("click", () => {
      actions.do("nav", "info", "splash");
    });
  },

  handleQueenButton() {
    // console.log('In the handleQueenButton method.');
    $(".js-queenButton").on("click", () => {
      $(".js-pageViewGameBoardHtml").fullScreen();
      actions.do("nav", "game", "splash");
    });
  },

  handleRulesButton() {
    // console.log('In the handleRulesButton method.');
    $(".js-rulesButton").on("click", () => {
      actions.do("nav", "rules", "game");
    });
  },

  handleMovesButton() {
    // console.log('In the handleMovesButton method.');
    $(".js-movesButton").on("click", () => {
      actions.do("nav", "moves", "rules");
    });
  },

  handleLoadSaveButton() {
    // console.log('In the handleLoadSaveButton method.');
    $(".js-loadSaveButton").on("click", () => {
      $(".fullScreen").fullScreen();
      actions.do("nav", "saves", "game");
    });
  },

  handleBackButtonInfoPage() {
    // console.log('In the handleBackButtonInfoPage method.');
    $(".js-backButtonInfoPage").on("click", () => {
      actions.do("nav", "splash", "info");
    });
  },

  handleBackButtonGamePage() {
    // console.log('In the handleBackButtonGamePage method.');
    $(".js-backButtonGamePage").on("click", () => {
      $(".fullScreen").fullScreen();
      actions.do("nav", "splash", "game");
    });
  },

  handleBackButtonRulesPage() {
    // console.log('In the handleBackButtonRulesPage method.');
    $(".js-backButtonRulesPage").on("click", () => {
      $(".js-pageViewGameBoardHtml").fullScreen();
      actions.do("nav", "game", "rules");
    });
  },

  handleBackButtonMovesPage() {
    // console.log('In the handleBackButtonMovesPage method.');
    $(".js-backButtonMovesPage").on("click", () => {
      actions.do("nav", "rules", "maves");
    });
  },

  handleBackButtonSavesPage() {
    // console.log('In the handleBackButtonSavesPage method.');
    $(".js-backButtonSavesPage").on("click", () => {
      $(".js-pageViewGameBoardHtml").fullScreen();
      actions.do("nav", "game", "saves");
    });
  },

  handleBackButtonCredentialsPage() {
    // console.log('In the handleBackButtonCredentialsPage method.');
    $(".js-backButtonCredentialsPage").on("click", () => {
      actions.do("nav", "saves", "credentials");
    });
  },

  handleResetButton() {
    // console.log('In the handleResetButton method.');
    $(".js-resetButton").on("click", () => {
      actions.do("reset");
    });
  },

  handleUndoButton() {
    // console.log('In the handleUndoButton method.');
    $(".js-undoButton").on("click", () => {
      actions.do("undo");
    });
  },

  handleRedoButton() {
    // console.log('In the handleRedoButton method.');
    $(".js-redoButton").on("click", () => {
      actions.do("redo");
    });
  },

  handleSignUpNavButton() {
    // console.log('In the handleSignUpNavButton method.');
    $(".js-signUpNavButton").on("click", () => {
      actions.do("signUpNav", "credentials", "saves");
    });
  },

  handleLogInNavButton() {
    // console.log('In the handleLogInNavButton method.');
    $(".js-logInNavButton").on("click", () => {
      actions.do("logInNav", "credentials", "saves");
    });
  },

  handleLogOutNavButton() {
    // console.log('In the handleLogOutNavButton method.');
    $(".js-logOutNavButton").on("click", () => {
      actions.do("logOutNav", "saves", "saves");
    });
  },

  handleSaveButton() {
    // console.log('In the handleSaveButton method.');
    $(".js-saveGameButton").on("click", () => {
      actions.do("save");
    });
  },

  handleLoadButton() {
    // console.log('In the handleLoadButton method.');
    $(".js-loadGameButton").on("click", () => {
      actions.do("load");
      $(".js-pageViewGameBoardHtml").fullScreen();
    });
  },

  handleUpdateButton() {
    // console.log('In the handleUpdateButton method.');
    $(".js-replaceGameButton").on("click", () => {
      actions.do("replace");
    });
  },

  handleDeleteButton() {
    // console.log('In the handleDeleteButton method.');
    $(".js-deleteGameButton").on("click", () => {
      actions.do("delete");
    });
  },

  handleFormSignUpButton() {
    // console.log('In the handleFormSignUpButton method.');
    $(".js-formSignUpButton").on("click", () => {
      actions.do("signUp");
    });
  },

  handleFormLogInButton() {
    // console.log('In the handleFormLogInButton method.');
    $(".js-formLogInButton").on("click", () => {
      actions.do("logIn");
    });
  },

  handleSubmit() {
    // console.log('In the handleSubmit method.');
    $(".credentialsForm").on("submit", event => {
      event.preventDefault();
    });
  },

  handleSquare() {
    // console.log('In the handleSquare method.');
    $(".boardContainer").on("click", ".square", function(event) {
      event.stopPropagation();
      let location = $(this).data("location");
      actions.do("square", location);
    });
  },

  handleSavedGameListItem() {
    // console.log('In the handleSavedGameListItem method.');
    $(".savedGamesList").on("click", "li", function(event) {
      event.stopPropagation();
      $("li.savedGame").removeClass("active");
      $(this)
        .closest("li.savedGame")
        .addClass("active");
      STORE.activeSavedGameExists = true;
      STORE.activeGame = $(this).data("id");
      STORE.activeGameMoves = STORE.savedGames[$(this).data("id")].moves;
      renderPage.configureGameButtons();
    });
  }
};

/********************************************************
 * Step 3: Take actions based on user inputs.
 ********************************************************/

const actions = {
  do(parm1, parm2, parm3) {
    if (parm1 === "nav") {
      this.navigate(parm2, parm3);
    } else if (parm1 === "reset") {
      this.reset();
    } else if (parm1 === "undo") {
      this.undo();
    } else if (parm1 === "redo") {
      this.redo();
    } else if (parm1 === "signUpNav") {
      this.signUpNav(parm2, parm3);
    } else if (parm1 === "logInNav") {
      this.logInNav(parm2, parm3);
    } else if (parm1 === "logOutNav") {
      this.logOutNav(parm2, parm3);
    } else if (parm1 === "signUp") {
      this.signUp();
    } else if (parm1 === "logIn") {
      this.logIn();
    } else if (parm1 === "save") {
      this.save();
    } else if (parm1 === "load") {
      this.load();
    } else if (parm1 === "replace") {
      this.replace();
    } else if (parm1 === "delete") {
      this.delete();
    } else if (parm1 === "square") {
      this.square(parm2);
    } else if (parm1 === "savedGame") {
      this.savedGame(parm2, parm3);
    }
  },

  navigate(currentView, previousView) {
    STORE.currentView = currentView;
    STORE.previousView = previousView;
    renderPage.doShowPages();
  },

  reset() {
    STORE.moves = [];
    STORE.redo = [];
    STORE.scoreMoves = 0;
    STORE.scoreSquares = 0;
    STORE.targetMoves = 14;
    STORE.targetSquares = 64;
    for (let i = 1; i < 9; i++) {
      for (let j = 1; j < 9; j++) {
        let resetSquare = String.fromCharCode(64 + i) + j;
        $(".js-" + resetSquare).removeClass("visited");
        $(".js-" + resetSquare).removeClass("occupied");
      }
    }
    $(".scoreTableMovesDone").html(`${STORE.scoreMoves}`);
    $(".scoreTableMovesToDo").html(`${STORE.targetMoves - STORE.scoreMoves}`);
    $(".scoreTableSquaresDone").html(`${STORE.scoreSquares}`);
    $(".scoreTableSquaresToDo").html(
      `${STORE.targetSquares - STORE.scoreSquares}`
    );
    $(".js-undoButton")
      .prop("disabled", true)
      .css("cursor", "not-allowed");
    $(".js-undoButton img").attr("src", "Images/Buttons/Undo_Grey_Button.png");
    $(".js-redoButton")
      .prop("disabled", true)
      .css("cursor", "not-allowed");
    $(".js-redoButton img").attr("src", "Images/Buttons/Redo_Grey_Button.png");
    $(".js-resetButton")
      .prop("disabled", true)
      .css("cursor", "not-allowed");
    $(".js-resetButton img").attr(
      "src",
      "Images/Buttons/Reset_Grey_Button.png"
    );
  },

  undo() {
    STORE.moves.pop();
    let recording = STORE.moves; // Cannot use STORE.moves in the second loop; it becomes endless.
    STORE.moves = [];
    STORE.scoreMoves = 0;
    STORE.scoreSquares = 0;
    STORE.targetMoves = 14;
    STORE.targetSquares = 64;
    for (let i = 1; i < 9; i++) {
      for (let j = 1; j < 9; j++) {
        let resetSquare = String.fromCharCode(64 + i) + j;
        $(".js-" + resetSquare).removeClass("visited");
        $(".js-" + resetSquare).removeClass("occupied");
      }
    }
    for (let i = 0; i < recording.length; i++) {
      this.square(recording[i]);
    }
    if (STORE.moves.length === 0) {
      $(".js-undoButton")
        .prop("disabled", true)
        .css("cursor", "not-allowed");
      $(".js-undoButton img").attr(
        "src",
        "Images/Buttons/Undo_Grey_Button.png"
      );
    }
    if (STORE.moves.length < STORE.redo.length) {
      $(".js-redoButton")
        .prop("disabled", false)
        .css("cursor", "pointer");
      $(".js-redoButton img").attr("src", "Images/Buttons/Redo_Button.png");
    }
    $(".scoreTableMovesDone").html(`${STORE.scoreMoves}`);
    $(".scoreTableMovesToDo").html(`${STORE.targetMoves - STORE.scoreMoves}`);
    $(".scoreTableSquaresDone").html(`${STORE.scoreSquares}`);
    $(".scoreTableSquaresToDo").html(
      `${STORE.targetSquares - STORE.scoreSquares}`
    );
  },

  redo() {
    for (let i = STORE.moves.length; i < STORE.redo.length; i++) {
      this.square(STORE.redo[i]);
      if (STORE.moves.length === STORE.redo.length) {
        $(".js-redoButton")
          .prop("disabled", true)
          .css("cursor", "not-allowed");
        $(".js-redoButton img").attr(
          "src",
          "Images/Buttons/Redo_Grey_Button.png"
        );
      }
      if (STORE.moves.length > 0) {
        $(".js-undoButton")
          .prop("disabled", false)
          .css("cursor", "pointer");
        $(".js-undoButton img").attr("src", "Images/Buttons/Undo_Button.png");
      }
      break;
    }
    $(".scoreTableMovesDone").html(`${STORE.scoreMoves}`);
    $(".scoreTableMovesToDo").html(`${STORE.targetMoves - STORE.scoreMoves}`);
    $(".scoreTableSquaresDone").html(`${STORE.scoreSquares}`);
    $(".scoreTableSquaresToDo").html(
      `${STORE.targetSquares - STORE.scoreSquares}`
    );
  },

  signUpNav(parm2, parm3) {
    $(".js-formSignUpButton").show();
    $(".js-formLogInButton").hide();
    $(".js-demoLogin").text("");
    $(".js-fieldsTitle").text("Sign Up");
    $("#username").val("");
    $("#password").val("");
    this.navigate(parm2, parm3);
  },

  logInNav(parm2, parm3) {
    $(".js-formSignUpButton").hide();
    $(".js-formLogInButton").show();
    $(".js-demoLogin").text(
      'Demo login: User Name: "demo", Password: "demopass1234".'
    );
    $(".js-fieldsTitle").text("Log In");
    $("#username").val("");
    $("#password").val("");
    this.navigate(parm2, parm3);
  },

  logOutNav(parm2, parm3) {
    STORE.activeUser = "";
    STORE.moves = [];
    STORE.redo = [];
    STORE.savedGames = [];
    STORE.scoreMoves = 0;
    STORE.scoreSquares = 0;
    for (let i = 1; i < 9; i++) {
      for (let j = 1; j < 9; j++) {
        let resetSquare = String.fromCharCode(64 + i) + j;
        $(".js-" + resetSquare).removeClass("visited");
        $(".js-" + resetSquare).removeClass("occupied");
      }
    }
    this.navigate(parm2, parm3);
  },

  signUp() {
    // console.log('In the signUp method.');
    let credentialsUser = $("#username").val();
    let credentialsPassword = $("#password").val();
    let data = { user: credentialsUser, password: credentialsPassword };
    fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .catch(error => console.error("Error:", error))
      .then(response => {
        STORE.activeUser = response.user;
        this.doLogIn(credentialsUser, credentialsPassword);
      });
  },

  logIn() {
    // console.log('In the logIn method.');
    let credentialsUser = $("#username").val();
    let credentialsPassword = $("#password").val();
    this.doLogIn(credentialsUser, credentialsPassword);
  },

  doLogIn(parmUser, parmPassword) {
    // console.log('In the doLogIn method.');
    let data = { user: parmUser, password: parmPassword };
    fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .catch(error => console.error("Error:", error))
      .then(response => {
        localStorage.setItem("jwt", response.authToken);
        STORE.activeUser = parmUser;
        STORE.currentView = "saves";
        STORE.previousView = "credentials";
        renderPage.doShowPages();
      });
  },

  square(selectedSquare) {
    // Lower left square -> selectedSquare = 'A1'
    // console.log('In the square method.');
    let legalMoveString = "";
    if (STORE.moves.length > 0) {
      let previousSquare = STORE.moves[STORE.moves.length - 1];
      legalMoveString = this.testLegal(previousSquare, selectedSquare);
      if (legalMoveString !== "") {
        this.removePiece(previousSquare);
      }
    }
    if (STORE.moves.length === 0) {
      this.placePiece(selectedSquare);
      STORE.moves.push(selectedSquare);
      if (STORE.moves.length > STORE.redo.length > 0) {
        STORE.redo.push(selectedSquare);
      }
      for (let i = 0; i < STORE.moves.length; i++) {
        if (STORE.moves[i] !== STORE.redo[i]) {
          STORE.redo = [...STORE.moves];
          break;
        }
      }
      $(".js-undoButton")
        .prop("disabled", false)
        .css("cursor", "pointer");
      $(".js-undoButton img").attr("src", "Images/Buttons/Undo_Button.png");
      $(".js-resetButton")
        .prop("disabled", false)
        .css("cursor", "pointer");
      $(".js-resetButton img").attr("src", "Images/Buttons/Reset_Button.png");
      this.updateScoreBoard(0, 1);
    } else if (legalMoveString !== "") {
      let previousSquare = STORE.moves[STORE.moves.length - 1];
      if (legalMoveString === "H") {
        // horizontal move
        let oldColNum = previousSquare.substring(0, 1).charCodeAt(0) - 64;
        let newColNum = selectedSquare.substring(0, 1).charCodeAt(0) - 64;
        let RowNum = parseInt(previousSquare.substring(1), 10);
        if (newColNum > oldColNum) {
          // right
          for (let i = 1; i < newColNum - oldColNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + oldColNum + i) + RowNum;
            if (
              document
                .querySelector(`.js-${betweenSquare}`)
                .classList.contains("visited") === false
            ) {
              STORE.scoreSquares++;
              this.visitSquare(betweenSquare);
            }
          }
          this.updateScoreBoard(
            1,
            document
              .querySelector(`.js-${selectedSquare}`)
              .classList.contains("visited") === false
              ? 1
              : 0
          );
        } else if (newColNum < oldColNum) {
          // left
          for (let i = 1; i < oldColNum - newColNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + oldColNum - i) + RowNum;
            if (
              document
                .querySelector(`.js-${betweenSquare}`)
                .classList.contains("visited") === false
            ) {
              STORE.scoreSquares++;
              this.visitSquare(betweenSquare);
            }
          }
          this.updateScoreBoard(
            1,
            document
              .querySelector(`.js-${selectedSquare}`)
              .classList.contains("visited") === false
              ? 1
              : 0
          );
        }
      } else if (legalMoveString === "V") {
        // vertical move
        let oldRowNum = parseInt(previousSquare.substring(1), 10);
        let newRowNum = parseInt(selectedSquare.substring(1), 10);
        let ColNum = previousSquare.substring(0, 1).charCodeAt(0) - 64;
        if (newRowNum > oldRowNum) {
          // up
          for (let i = 1; i < newRowNum - oldRowNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + ColNum) + (oldRowNum + i);
            if (
              document
                .querySelector(`.js-${betweenSquare}`)
                .classList.contains("visited") === false
            ) {
              STORE.scoreSquares++;
              this.visitSquare(betweenSquare);
            }
          }
          this.updateScoreBoard(
            1,
            document
              .querySelector(`.js-${selectedSquare}`)
              .classList.contains("visited") === false
              ? 1
              : 0
          );
        } else if (newRowNum < oldRowNum) {
          // down
          for (let i = 1; i < oldRowNum - newRowNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + ColNum) + (oldRowNum - i);
            if (
              document
                .querySelector(`.js-${betweenSquare}`)
                .classList.contains("visited") === false
            ) {
              STORE.scoreSquares++;
              this.visitSquare(betweenSquare);
            }
          }
          this.updateScoreBoard(
            1,
            document
              .querySelector(`.js-${selectedSquare}`)
              .classList.contains("visited") === false
              ? 1
              : 0
          );
        }
      } else if (legalMoveString === "D") {
        // diagonal move
        let oldColNum = previousSquare.substring(0, 1).charCodeAt(0) - 64;
        let oldRowNum = parseInt(previousSquare.substring(1), 10);
        let newColNum = selectedSquare.substring(0, 1).charCodeAt(0) - 64;
        let newRowNum = parseInt(selectedSquare.substring(1), 10);
        if (newColNum > oldColNum && newRowNum > oldRowNum) {
          // up and right
          for (let i = 1; i < newColNum - oldColNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + oldColNum + i) + (oldRowNum + i);
            if (
              document
                .querySelector(`.js-${betweenSquare}`)
                .classList.contains("visited") === false
            ) {
              STORE.scoreSquares++;
              this.visitSquare(betweenSquare);
            }
          }
          this.updateScoreBoard(
            1,
            document
              .querySelector(`.js-${selectedSquare}`)
              .classList.contains("visited") === false
              ? 1
              : 0
          );
        } else if (newColNum > oldColNum && newRowNum < oldRowNum) {
          // down and right
          for (let i = 1; i < newColNum - oldColNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + oldColNum + i) + (oldRowNum - i);
            if (
              document
                .querySelector(`.js-${betweenSquare}`)
                .classList.contains("visited") === false
            ) {
              STORE.scoreSquares++;
              this.visitSquare(betweenSquare);
            }
          }
          this.updateScoreBoard(
            1,
            document
              .querySelector(`.js-${selectedSquare}`)
              .classList.contains("visited") === false
              ? 1
              : 0
          );
        } else if (newColNum < oldColNum && newRowNum < oldRowNum) {
          // down and left
          for (let i = 1; i < oldColNum - newColNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + oldColNum - i) + (oldRowNum - i);
            if (
              document
                .querySelector(`.js-${betweenSquare}`)
                .classList.contains("visited") === false
            ) {
              STORE.scoreSquares++;
              this.visitSquare(betweenSquare);
            }
          }
          this.updateScoreBoard(
            1,
            document
              .querySelector(`.js-${selectedSquare}`)
              .classList.contains("visited") === false
              ? 1
              : 0
          );
        } else if (newColNum < oldColNum && newRowNum > oldRowNum) {
          // up and left
          for (let i = 1; i < oldColNum - newColNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + oldColNum - i) + (oldRowNum + i);
            if (
              document
                .querySelector(`.js-${betweenSquare}`)
                .classList.contains("visited") === false
            ) {
              STORE.scoreSquares++;
              this.visitSquare(betweenSquare);
            }
          }
          this.updateScoreBoard(
            1,
            document
              .querySelector(`.js-${selectedSquare}`)
              .classList.contains("visited") === false
              ? 1
              : 0
          );
        }
      }
      this.placePiece(selectedSquare);
      STORE.moves.push(selectedSquare);
      if (STORE.moves.length > STORE.redo.length > 0) {
        STORE.redo.push(selectedSquare);
      }
      for (let i = 0; i < STORE.moves.length; i++) {
        if (STORE.moves[i] !== STORE.redo[i]) {
          STORE.redo = [...STORE.moves];
          break;
        }
      }
    }
  },

  savedGame(selectedSquare, newElement) {
    // console.log('In the savedGame method.');
    let legalMoveString = "";
    if (STORE.redrawMoves.length > 0) {
      let previousSquare = STORE.redrawMoves[STORE.redrawMoves.length - 1];
      legalMoveString = this.testLegal(previousSquare, selectedSquare);
      if (legalMoveString !== "") {
        this.removePiece(previousSquare, true, newElement);
      }
    }
    if (STORE.redrawMoves.length === 0) {
      this.placePiece(selectedSquare, true, newElement);
      STORE.redrawMoves.push(selectedSquare);
    } else if (legalMoveString !== "") {
      let previousSquare = STORE.redrawMoves[STORE.redrawMoves.length - 1];
      if (legalMoveString === "H") {
        // horizontal move
        let oldColNum = previousSquare.substring(0, 1).charCodeAt(0) - 64;
        let newColNum = selectedSquare.substring(0, 1).charCodeAt(0) - 64;
        let RowNum = parseInt(previousSquare.substring(1), 10);
        if (newColNum > oldColNum) {
          // right
          for (let i = 1; i < newColNum - oldColNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + oldColNum + i) + RowNum;
            if (
              newElement
                .find(`.js-saved-${betweenSquare}`)
                .hasClass("visited") === false
            ) {
              this.visitSquare(betweenSquare, true, newElement);
            }
          }
        } else if (newColNum < oldColNum) {
          // left
          for (let i = 1; i < oldColNum - newColNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + oldColNum - i) + RowNum;
            if (
              newElement
                .find(`.js-saved-${betweenSquare}`)
                .hasClass("visited") === false
            ) {
              this.visitSquare(betweenSquare, true, newElement);
            }
          }
        }
      } else if (legalMoveString === "V") {
        // vertical move
        let oldRowNum = parseInt(previousSquare.substring(1), 10);
        let newRowNum = parseInt(selectedSquare.substring(1), 10);
        let ColNum = previousSquare.substring(0, 1).charCodeAt(0) - 64;
        if (newRowNum > oldRowNum) {
          // up
          for (let i = 1; i < newRowNum - oldRowNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + ColNum) + (oldRowNum + i);
            if (
              newElement
                .find(`.js-saved-${betweenSquare}`)
                .hasClass("visited") === false
            ) {
              this.visitSquare(betweenSquare, true, newElement);
            }
          }
        } else if (newRowNum < oldRowNum) {
          // down
          for (let i = 1; i < oldRowNum - newRowNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + ColNum) + (oldRowNum - i);
            if (
              newElement
                .find(`.js-saved-${betweenSquare}`)
                .hasClass("visited") === false
            ) {
              this.visitSquare(betweenSquare, true, newElement);
            }
          }
        }
      } else if (legalMoveString === "D") {
        // diagonal move
        let oldColNum = previousSquare.substring(0, 1).charCodeAt(0) - 64;
        let oldRowNum = parseInt(previousSquare.substring(1), 10);
        let newColNum = selectedSquare.substring(0, 1).charCodeAt(0) - 64;
        let newRowNum = parseInt(selectedSquare.substring(1), 10);
        if (newColNum > oldColNum && newRowNum > oldRowNum) {
          // up and right
          for (let i = 1; i < newColNum - oldColNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + oldColNum + i) + (oldRowNum + i);
            if (
              newElement
                .find(`.js-saved-${betweenSquare}`)
                .hasClass("visited") === false
            ) {
              this.visitSquare(betweenSquare, true, newElement);
            }
          }
        } else if (newColNum > oldColNum && newRowNum < oldRowNum) {
          // down and right
          for (let i = 1; i < newColNum - oldColNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + oldColNum + i) + (oldRowNum - i);
            if (
              newElement
                .find(`.js-saved-${betweenSquare}`)
                .hasClass("visited") === false
            ) {
              this.visitSquare(betweenSquare, true, newElement);
            }
          }
        } else if (newColNum < oldColNum && newRowNum < oldRowNum) {
          // down and left
          for (let i = 1; i < oldColNum - newColNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + oldColNum - i) + (oldRowNum - i);
            if (
              newElement
                .find(`.js-saved-${betweenSquare}`)
                .hasClass("visited") === false
            ) {
              this.visitSquare(betweenSquare, true, newElement);
            }
          }
        } else if (newColNum < oldColNum && newRowNum > oldRowNum) {
          // up and left
          for (let i = 1; i < oldColNum - newColNum; i++) {
            let betweenSquare =
              String.fromCharCode(64 + oldColNum - i) + (oldRowNum + i);
            if (
              newElement
                .find(`.js-saved-${betweenSquare}`)
                .hasClass("visited") === false
            ) {
              this.visitSquare(betweenSquare, true, newElement);
            }
          }
        }
      }
      this.placePiece(selectedSquare, true, newElement);
      STORE.redrawMoves.push(selectedSquare);
    }
  },

  testLegal(currentSquare, proposedSquare) {
    // Determines if a proposed move is legal.
    // console.log('In the testLegal method.');
    let oldColNum = currentSquare.substring(0, 1).charCodeAt(0) - 64;
    let oldRowNum = parseInt(currentSquare.substring(1), 10);
    let newColNum = proposedSquare.substring(0, 1).charCodeAt(0) - 64;
    let newRowNum = parseInt(proposedSquare.substring(1), 10);
    let legalHorizonal =
      oldColNum !== newColNum && oldRowNum === newRowNum ? "H" : "";
    let legalVertical =
      oldColNum === newColNum && oldRowNum !== newRowNum ? "V" : "";
    let legalDiagonal =
      Math.abs(oldColNum - newColNum) === Math.abs(oldRowNum - newRowNum)
        ? "D"
        : "";
    return legalHorizonal + legalVertical + legalDiagonal;
  },

  visitSquare(visitedSquare, savedGame, newElement) {
    // Adds a yellow overlay to a square. Maybe more code later.
    // console.log('In the visitSquare method.');
    if (savedGame) {
      newElement.find(".js-saved-" + visitedSquare).addClass("visited");
    } else {
      $(".js-" + visitedSquare).addClass("visited");
    }
  },

  placePiece(landedSquare, savedGame, newElement) {
    // Adds a yellow overlay with chess piece on top.
    // console.log('In the placePiece method.');
    if (savedGame === true) {
      newElement.find(".js-saved-" + landedSquare).addClass("visited occupied");
    } else {
      $(".js-" + landedSquare).addClass("visited occupied");
    }
  },

  removePiece(vacatedSquare, savedGame, newElement) {
    // Removes chess piece, leaving yellow overlay.
    // console.log('In the removePiece method.');
    if (savedGame) {
      newElement.find(".js-saved-" + vacatedSquare).removeClass("occupied");
    } else {
      $(".js-" + vacatedSquare).removeClass("occupied");
    }
  },

  updateScoreBoard(movesincr, squaresincr) {
    // console.log('In the updateScoreBoard method.');
    STORE.scoreMoves = STORE.scoreMoves + movesincr;
    STORE.scoreSquares = STORE.scoreSquares + squaresincr;
    $(".scoreTableMovesDone").html(`${STORE.scoreMoves}`);
    $(".scoreTableMovesToDo").html(`${STORE.targetMoves - STORE.scoreMoves}`);
    $(".scoreTableSquaresDone").html(`${STORE.scoreSquares}`);
    $(".scoreTableSquaresToDo").html(
      `${STORE.targetSquares - STORE.scoreSquares}`
    );
  },

  save() {
    // console.log('In the save method.');
    fetch("/api/games/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
        moves: `${STORE.moves}`,
        puzzle: `${STORE.puzzle}`
      })
    })
      .then(res => res.json())
      .catch(error => console.error("Error:", error))
      .then(response => {
        STORE.savedGames.push({
          id: response._id,
          dateTime: response.created,
          moves: response.moves[0].split(",")
        });
        this.doGamesListHtml();
      });
  },

  load() {
    // console.log('In the load method.');
    let selectedGameMoves = STORE.savedGames[STORE.activeGame].moves;
    actions.reset();
    for (let i = 0; i < selectedGameMoves.length; i++) {
      actions.square(selectedGameMoves[i]);
    }
    STORE.activeSavedGameExists = false;
    actions.do("nav", "game", "saves");
  },

  replace() {
    // console.log('In the replace method.');
    let selectedGameId = STORE.savedGames[STORE.activeGame].id;
    fetch(`/api/games/${selectedGameId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({ moves: `${STORE.moves}`, id: `${selectedGameId}` })
    })
      .catch(error => console.error("Error:", error))
      .then(response => {
        STORE.savedGames[STORE.activeGame].moves = STORE.moves;
        fetch(`/api/games/${selectedGameId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          }
        })
          .catch(error => console.error("Error:", error))
          .then(response => {
            STORE.savedGames[STORE.activeGame].dateTime = response.created;
          });
        this.doGamesListHtml();
      });
  },

  delete() {
    // console.log('In the delete method.');
    let selectedGameId = STORE.savedGames[STORE.activeGame].id;
    fetch(`/api/games/${selectedGameId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
      }
    })
      .catch(error => console.error("Error:", error))
      .then(response => {
        STORE.savedGames.splice(STORE.activeGame, 1);
        this.doGamesListHtml();
      });
  },

  doGamesListHtml() {
    // console.log('In the doGamesListHtml method.');

    $(".savedGamesList").html("");
    let htmlGameMoves = "";
    for (let i = 0; i < STORE.savedGames.length; i++) {
      htmlGameMoves = `<li data-id='${i}' class='savedGame'><div class='savedGameBoardContainer'>`;
      for (let j = 8; j > 0; j--) {
        for (let k = 65; k < 73; k++) {
          htmlGameMoves += `<div class='square js-saved-${String.fromCharCode(
            k
          )}${j}'></div>`;
        }
      }
      htmlGameMoves +=
        `</div>` +
        `<div class='dateTimeStamp'>
                ${moment(STORE.savedGames[i].dateTime).format(
                  "MMMM DD YYYY HH:mm"
                )}</div></li>`;
      let newElement = $(htmlGameMoves);
      STORE.redrawMoves = [];
      let currentMove = "";
      for (let j = 0; j < STORE.savedGames[i].moves.length; j++) {
        currentMove = STORE.savedGames[i].moves[j];
        actions.do("savedGame", currentMove, newElement);
      }
      $(".savedGamesList").append(newElement);
    }
    renderPage.configureGameButtons();
  }
};

/*****************************
 * Javascript starts here.
 ****************************/

function main() {
  // console.log('Begin the program');
  renderPage.doShowPages();
  listeners.listen();
}

$(main);
