'use strict';

/******************************************************** 
 All global variables here. 
********************************************************/

const STORE = {  // All the variables connected with the state of the DOM go here.
    currentView: 'splash'
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
    }
};

/************************************************************* 
Step 1b: Render each HTML page, based on the current state. 
**************************************************************/

const renderPage={
   doShowPages: function(){
        console.log('In the doShowPages method.');
        if(STORE.currentView==='splash'){
            this.splashPage();
        }else if(STORE.currentView==='info'){
            this.infoPage();
        }
   },

    showCurrentPage: function(pageToShow){
        console.log('In the showCurrentPage method.');
        $('div.js-pageViewSplashHtml').hide();
        $('div.js-pageViewInfoHtml').hide();
        $(pageToShow).show();
    },

    splashPage: function(){
        console.log('In the splashPage method.');
        this.showCurrentPage('div.js-pageViewSplashHtml');
    },

    infoPage: function(){
        console.log('In the infoPage method.');
        this.showCurrentPage('div.js-pageViewInfoHtml');
    },
};

/******************************************************** 
 * Step 2: Listen for user interactions.
 ********************************************************/

const Listeners={
    listen: function(){
        console.log('In the listen method.');
        this.handleInfoButton();
        this.handleBackButtonInfoPage();
    },

    handleInfoButton: function(){
        console.log('In the handleInfoButton method.');
        $('.js-infoButton').on('click', function() {
            STORE.currentView='info';
            renderPage.doShowPages();
        });
    },

    handleBackButtonInfoPage: function(){
        console.log('In the handleBackButtonInfoPage method.');
        $('.js-backButtonInfoPage').on('click', function() {
            console.log('clicked the back button');
            STORE.currentView='splash';
            console.log(STORE.currentView);
            renderPage.doShowPages();
        });
    },
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
    // generateHtml.doHtmlPages();
    renderPage.doShowPages();
    Listeners.listen();
};

$(main);