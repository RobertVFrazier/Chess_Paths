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
        }
   },

    showCurrentPage: function(pageToShow, userButtonText){
        // console.log('In the showCurrentPage method.');
        $('div.js-pageViewSplashHtml').hide();
        $(pageToShow).show();
    },

    splashPage: function(){
        // console.log('In the splashPage method.');
        this.showCurrentPage('div.js-pageViewSplashHtml', 'Start');
    }
};

/******************************************************** 
 * Step 2: Listen for user interactions.
 ********************************************************/

const listeners={
};

/******************************************************** 
 * Step 3: Get API data to match user inputs.
 ********************************************************/

const getFlickrPics={
};

/***************************** 
 * Javascript starts here.
 ****************************/

function main(){
    // console.log('Begin the program');
    generateHtml.doHtmlPages();
    renderPage.doShowPages();
};

$(main);