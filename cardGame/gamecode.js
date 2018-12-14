/**
 * Created by Beth MacIsaac on 4/9/2018.
 * This game is still kind of lame, i was hoping to get more gameplay features going but meeting the actual requirements took longer than
 * i thought it would. so this is version 1.0, it will be way cooler by fall
 * I am going to be adding new games, the cards apt has a piles functionality that should be cool to play with
 */

//i stored my changeable variables  in this object, this has the added advantage of allowing me
//easily store my game states in local storage at regular intervals
let myGame = {
    current_deck:"",
    score:0,
    last_card:0,
    last_guess:0,
    current_streak:0,
    longest_streak:0,
    remaining_cards:0,
    player_name:null,
    need_shuffle:false,
    ace_value:1
};

//these are all html page elements, I am not sure how they would act in my game object
let image_section;
let card_img;
let streak_tracker;
let streak_record;
let scoreboard;
let cards_left;
let loaded_message;
let dismiss_button;
let save_name_button;
let name_textbox;
let name_div;
let dismiss_timeout;

let game_helper = new BethLib;

function start() {

    //here i am declaring all the elements i want to manipulate
    image_section = document.querySelector('#cardPic');
    streak_tracker = document.querySelector("#streakBox");
    streak_record = document.querySelector('#longestStreakBox');
    scoreboard= document.querySelector("#scoreBox");
    cards_left = document.querySelector("#remainingCards");
    loaded_message = document.querySelector("#newGame");
    dismiss_button = document.querySelector("#btnDismiss");
    save_name_button = document.querySelector("#saveName");
    name_div = document.querySelector('#getPlayerName');

    // console.log(localStorage);//this line was here for testing purposes

    //this code runs if the program finds data in local storage
    if (localStorage.length > 0){

        //using my library class to hide and show elements
        game_helper.showElement(loaded_message);

        //these two lines get rid of the initial "data has been loaded" message
        //either by timout or manual dismissal. this div also includes the option to start a new game instead
        dismiss_button.addEventListener('click', dismissMessage);
        dismiss_timeout = setTimeout(dismissMessage, 20000);

        //this adds an eventlistener to my submit name textbox and button
        save_name_button.addEventListener('click', writeName);

        //this line grabs and parses data from local storage
        let loaded_stuff = JSON.parse(localStorage.saved_data);
        myGame.current_deck = loaded_stuff.current_deck;

        //this sets my parsed object as the active game object. which was really cool when i figured it out
        myGame = loaded_stuff;

        //this updates my scores to what is stored in memory
        scoreboard.value = myGame.score;
        streak_tracker.value = myGame.current_streak;
        streak_record.value = myGame.longest_streak;
        cards_left.value = myGame.remaining_cards;
        myGame.need_shuffle = false;

        //if there is a name stored in my database, skip the enter name step and just say hi to that person
        if (myGame.player_name != null){
            game_helper.hideElement(name_div);
            displayWelcomeMessage();
        }

    }

    //these are my event listeners, this one shuffles the deck when the user presses start
    document.querySelector("#startBtn").addEventListener("click", shuffleDeck);

    //this saves the game and shuffles the deck
    document.querySelector("#btnSave").addEventListener("click", resetAndEvaluate);

    //this calls the drawCard function with an argument of higher when the higher button is pressed
    // (which is why it is in  an anonymous function)
    document.querySelector("#higherBtn").addEventListener("click", function () {
        drawCard("higher");
    });

    //this calls draw with an argument of lower when the lower button is pressed
    document.querySelector("#lowerBtn").addEventListener("click", function () {
        drawCard("lower");
    });

    //this sets the ace value to the users preference on change
    document.querySelector("#aceSelect").addEventListener("change", function () {
        setAceValue(this.value);
    });



    //this button offers to reshuffle the deck when the player runs out of cards
    document.querySelector("#shuffle").addEventListener("click", shuffleDeck);

    //this resets the data if the user selects new game
    document.querySelector("#btnNewGame").addEventListener("click", resetData);


}

//this function sets the value of the ace card to either 1 or 14 depending on if user wants ace high or ace low
function setAceValue(ace_value) {
    myGame.ace_value = parseInt(ace_value);
}

//this function gets the user's name from input  then validates it
function writeName() {

    name_textbox = document.querySelector('#playerName');
    let player_name = name_textbox.value;
    // while (true)

    //i have arbitrarily set a limit of 10 letter-only characters for a user name
    //if the input is valid, it writes the user name to the game object, and hides the input box
    if (isNameValid(player_name)) {
        myGame.player_name = name_textbox.value;
        saveProgress();
        game_helper.hideElement(name_div);
        //after validating and saving the user name, i display a welcome message
        displayWelcomeMessage();

    }
    //otherwise i let the user know entry is invalid
    else {
        name_textbox.value = "Please re-enter name (max 10 chars)";
    }

}

function imgHighlight(card){
    console.log(card);
    card.style.backgroundColor = "rebeccapurple";
}

function imgUnHighlight(card){
    card.style.backgroundColor = "transparent";
}

//this function says hi to the user
function displayWelcomeMessage(){
    let welcome_banner = document.querySelector('#welcome');

    let name_h5 = document.createElement('h5');
    name_h5.innerHTML = `Hi ${myGame.player_name}!`;

    welcome_banner.appendChild(name_h5);
}

//this lets the player know they are out of cards
function gameIsOver(){

    game_helper.showElement(document.querySelector('#gameOver'));
    resetAndEvaluate();

}

//this saves calls the save funtion befor resetting user data
function resetAndEvaluate(){

    saveProgress();
    resetData();

}

//this saves my game object into storage
function saveProgress() {
    let game_records = JSON.stringify(myGame);
    localStorage.setItem("saved_data", game_records);
    myGame.need_shuffle = false;


}

//this resets data when the user selects a new game, it attempts to reshuffle the deck without throwing it away
function resetData(){
    let deck_data;
    //set a name for my XHR
    let data_request = new XMLHttpRequest();

    // do all the preliminary steps
    data_request.addEventListener('load', function (external_data) {
        let unparsed_data = external_data.target.responseText;
        deck_data = JSON.parse(unparsed_data);
        myGame.current_deck = deck_data.deck_id;
        console.log(myGame.current_deck);
        drawCard("tie");
    });

    //get the link i want to get data from
    data_request.open('GET', 'https://deckofcardsapi.com/api/deck/' + myGame.current_deck + '/shuffle/');

    // send the request
    data_request.send();

    //this resets my user's scores, except for the streak record
    myGame.score = 0;
    myGame.current_streak = 0;
    myGame.last_guess = "tie";
    scoreboard.value = myGame.score;
    streak_tracker.value = myGame.current_streak;

    //i am using a boolean to attempt to control when the game shuffles back to 52 cards, it's still a bit buggy
    myGame.need_shuffle = true;
}

//this shuffles my deck
function shuffleDeck(){

    //here i hide some ititial values when i start actually playing the game
    game_helper.hideElement(document.querySelector("main article"));
    game_helper.hideElement(document.querySelector('#gameOver'));

    if (localStorage.length > 0 && myGame.need_shuffle == false) {

        drawCard("tie");
    }

    //the api has to be called to shuffle the deck for me
    else {
        let deck_data;
        //set a name for my XHR
        let data_request = new XMLHttpRequest();

        // do all the preliminary steps
        data_request.addEventListener('load', function (external_data) {
            let unparsed_data = external_data.target.responseText;
            deck_data = JSON.parse(unparsed_data);
            console.log(deck_data);
            myGame.current_deck = deck_data.deck_id;

            // console.log(myGame.current_deck);
            drawCard("tie");
        });

        //get the link i want to get data from
        data_request.open('GET', 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');

        // send the request
        data_request.send();
    }


}

//this manually dismisses the message that lets my player know there is saved data
function dismissMessage(){

    game_helper.hideElement(loaded_message);
    clearTimeout(dismiss_timeout);

}

//this function draws a card, which requires me to call the api
function drawCard(guess_string){
   //the higher or lower argument is passed to this function so it can decide what to do
    myGame.last_guess = guess_string;

    image_section.innerHTML="";
    //set a name for my XHR
    let data_request = new XMLHttpRequest();
    // do all the preliminary steps
    data_request.addEventListener('load',function(external_data)
    {
        let unparsed_data = external_data.target.responseText;
        //this call returns card data for one card
        let drawn_card = JSON.parse(unparsed_data);

        //once a card id drawn, we have to see what the value is, i also pass the newly drawn card
        parseCardValue(drawn_card, myGame.last_guess);

    });

    //get the link i want to get data from
    data_request.open('GET','https://deckofcardsapi.com/api/deck/' + myGame.current_deck +'/draw/?count=1');

    // send the request
    data_request.send();
}

//this checks the card value, if it is not a number it evaluates the value of ace,jack, queen or king
function parseCardValue(drawn_card, higher_or_lower){
    //i save the data every time this function is called
    saveProgress();

    //this gets the number of cards remaining
    myGame.remaining_cards = parseInt(drawn_card.remaining);
    console.log(drawn_card);

    //this displays how many cards are left in the current deck
    cards_left.value = myGame.remaining_cards;

    //if there are no cards yet, display the game over message
    if (myGame.remaining_cards == 0){

        gameIsOver();
    }

    let card_value = 0;
    let card_data = drawn_card.cards[0].value;

    //here i attempt to parse the card data
    card_value = parseInt(card_data);

    //if the card is not a number (NaN) then it is an ace or a face card, and must be delt with appropriately
     if (isNaN(card_value)){

            //my first successful use of a switch statement in js?
            switch (card_data){

                //if the card is an ace i set it to the user defined ace value
                case "ACE":
                    card_value = myGame.ace_value;
                    break;

                //jack, queen and king are set to 11, 12 and 13 respectively
                case "JACK":
                    card_value = 11;
                    break;

                case "QUEEN":
                    card_value = 12;
                    break;

                case "KING":
                    card_value = 13;
                    break;
            }

        }


    //this handles the case of the card being the first drawn
     if (myGame.last_card == 0) {

         myGame.last_card = card_value;

     }

     //this evealuates the cards vs the guesses only if the card values have been parsed
    //and the card is not the first card drawn
    if (isNaN(card_value) == false && card_value > 0){
        let card_pic = document.createElement('img');

        //setting the card image
        card_pic.setAttribute('src', drawn_card.cards[0].image);
        image_section.appendChild(card_pic);

        //highlights card on mouseover
        document.querySelector("img").addEventListener("mouseover", function () {
            imgHighlight(this);
        });

        //unhighlights card on mouseout
        document.querySelector("img").addEventListener("mouseout", function () {
            imgUnHighlight(this);
        });

        //two different evaluation functions are called depending on if the user guessed higher or lower
        if (myGame.last_card > 0) {

            if (higher_or_lower === 'higher') {
                higherGuess(card_value);
            }

            else if (higher_or_lower === 'lower') {
                lowerGuess(card_value);
            }
        }
    }
}

//evaluates a higher guess
function higherGuess(drawn_card){

    //if the user is right i increment the score and the streak
    if (drawn_card > myGame.last_card) {
        myGame.score++;
        myGame.current_streak++;
    }

    //otherwise i subtract from the score
    if (drawn_card < myGame.last_card) {
        myGame.score--;
        myGame.current_streak = 0;
    }

    //next i have to see if the current streak beats the previous record
    myGame.longest_streak = streakEvaluation(myGame.current_streak, myGame.longest_streak);

    //and output streak data to screen
    streak_tracker.value = myGame.current_streak;
    streak_record.value = myGame.longest_streak;

    //next i output the score, i left negatives in intentionally and will change their colour
    //to RED to show that it is intentional
    scoreboard.value = myGame.score;
    if (myGame.score <= 0){
        scoreboard.style.color = "red";
    }
    else if(myGame.score > 0 ){
        scoreboard.style.color = "darkslategrey";
    }
    //then i set the last card to the current card because i am done this turn
    myGame.last_card = drawn_card;

}

//this function works exactly the same as higherGuess, except evaluates a lower guess
function lowerGuess(drawn_card){

    if (drawn_card < myGame.last_card) {
        myGame.score++;
        myGame.current_streak++;
    }

    if (drawn_card > myGame.last_card) {
        myGame.score--;
        myGame.current_streak = 0;
    }

    myGame.longest_streak = streakEvaluation(myGame.current_streak, myGame.longest_streak);

    streak_tracker.value = myGame.current_streak;
    streak_record.value = myGame.longest_streak;

    //outputting the score, i left negatives in intentionally and will change their colour
    //to RED to show that it is intentional
    scoreboard.value = myGame.score;
    if (myGame.score <= 0){
        scoreboard.style.color = "red";
    }
    else if(myGame.score > 0 ){
        scoreboard.style.color = "darkslategrey";
    }

    scoreboard.value = myGame.score;
    myGame.last_card = drawn_card;

}

//this funtion checks if the current streak is longer than the previous record
function streakEvaluation(current_streak, longest_streak) {

    let winner = 0;

    if (current_streak >= longest_streak){
        winner = current_streak;
    }

    else if (current_streak < longest_streak) {
        winner = longest_streak;
    }

    return winner;

}

//this is my name validation method using regex
function isNameValid(name){

    let validName = false;
    let pattern =  new RegExp("^[a-z]{1,10}");

    if (pattern.test(name.toLowerCase())){
        validName = true;
    }

return validName;

}


//this calls my start function
window.addEventListener('load', start);