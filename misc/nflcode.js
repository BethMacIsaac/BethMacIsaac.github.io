/*
Author: Beth MacIsaac
Date: July 24-25, 2019
Language: JavaScript (ES6)

on the nfl.html file, I called this script asynchronously, so it would only run after the main page has loaded
putting my code within the main function will keep my variables out of the global scope,
this is only one way to achieve this goal, but I like the readability of this method*/
'use strict';
window.addEventListener('load', main);

function main() {

    //here I am grabbing the existing html elements that I will need to reference
    let teamTable = document.querySelector('table');
    //I am aware I could have just used document.getElementByID here, but I find querySelector less cumbersome to type
    let conferenceSelect = document.querySelector('#conferenceSelect');
    let divisionSelect = document.querySelector('#divisionSelect');

    //this section of code puts event listeners on the filter selectboxes. they will activate when the value changes
    conferenceSelect.addEventListener('change', filterByLeague);
    divisionSelect.addEventListener('change', filterByRegion);

    //click this button to reset all the filters and show the whole list
    document.querySelector('#resetFilters').addEventListener('click', resetRows);

    //setting the filters to their default value, which is none
    let confFilter = "None";
    let divFilter = "None";

    //This object will hold the list of rows after they exist, so I can reference this instead of repeatedly performing the ajax (fetch) call
    let rowList;

    /*I am getting a CORS error when reaching out to the API, as far as I know that is a server side error in
    the headers being sent by the api, there are proxys that can be used to fix the same-origin problem, but
    my assumption is there was a change made to the API recently and fixing this problem is not meant to be part
    of the challenge. After troubleshooting for a while, I've commented out the call I tried to make, and used a local
    copy of the data. If I was actually working on a project for a client, I would contact the administrators of the
    api and inquire if they are aware of the problem. this method will work with other apis, I tested it*/

    // fetch('http://delivery.chalk247.com/team_list/NFL.JSON?api_key=74db8efa2a6db279393b433d97c2bc843f8e32b0', {
    //     mode: 'no-cors'
    // })

    //I made a json file called acmedata.json, that contains all the information I should have gotten from the API
    fetch('./acmedata.json')
        .then(response => {

            //this produces my own error message if there is a problem with the api response.
            if (!response.ok){
                console.log("Sorry, unable to reach api right now. Please try again later.");
            }
            else{
                //if everything is ok, pass on the data
               return response.json()
            }
        })
        .then(teamData =>{
            //now that we have the data I call the showData to build the table
            showData(teamData);
        });


    function showData(teamData){
        /*teamData is the retrieved and parsed JSON object. Once I have the data, I use a forEach loop to add every team to the table,
        if I was using react or a similar framework this is where I would use the array.map function,
        but since I'm using plain old JS a forEach loop works fine. The actual array I need to traverse
        is 3 layers deep into the json object, so I had to be careful to reference it properly*/
        teamData.results.data.team.forEach(team =>{
            //create the row (tr) before the cells (td)
            let newRow = document.createElement('tr');

            //create cells in the four columns i set up in nfl.html
            let cityTd = document.createElement('td');
            //add properties to the newly created cells, repeat for all 4 cells in the current new row
            cityTd.textContent = team.name;

            let teamTd = document.createElement('td');
            teamTd.textContent = team.nickname;

            let confTd = document.createElement('td');
            confTd.textContent = team.conference;
            //I gave the conference and division columns a class so I can reference them in the filter later
            confTd.className = "confCell";

            let divisionTd = document.createElement('td');
            divisionTd.textContent = team.division;
            divisionTd.className = "divCell";

            /*I gave each row a class of the team name so they each have a unique identifier I can easily reference
            in hindsight, this could also have been an ID. Class is a little safer though.*/
            newRow.className = team.nickname;
            /*while I am creating the row, I add an event listener on the click event, to be more efficient
             i could have also done it after the fact. When I was learning JS, I learned the hard way that,
            if you're passing an argument to a function and you don't want to fire immediately, the call must be inside its
             own callback function.*/
            newRow.addEventListener('click', ()=>{//anonymous callback function
                highlightRow(newRow);//function I actually want to call on click
            });

            //add the cells to the row
            newRow.appendChild(cityTd);
            newRow.appendChild(teamTd);
            newRow.appendChild(confTd);
            newRow.appendChild(divisionTd);

            //add the row to the table
            teamTable.appendChild(newRow);
        });//end of loop iteration

        /*once the rows have been created create a nodeList of the rows I can reference
        later without having to use fetch again until the page is reloaded from browser*/
        rowList = document.querySelectorAll('tr');
    }//end of showData function

    //this function is called every time the confFilter select box changes. it hides the unwanted rows in the table
    function filterByLeague(){
        //confFilter is the select box object that I grabbed in the parent function. I need the current value
       confFilter = conferenceSelect.value;
       //grab all my tds in the .confCell column
       let confTds = document.querySelectorAll('.confCell');
        confTds.forEach(cell =>{
            //iterate through the cells with the class .confCell and check if they match the filter selected (ie AMC or NFC)
            if(confFilter === "None"){
                cell.parentElement.style.display = "table-row";
            }
            else if (!(cell.textContent === confFilter)){
                /*if the cell doesn't match the selected filter, hide the cell's parent element (ie the row).
                Note that this does not delete the row, it only hides it with CSS*/
                cell.parentElement.style.display = "none";
            }
            //if the filter does match the row then display it, I chose to be specific here, rather than using just an else statement
            else if(cell.textContent === confFilter){
                cell.parentElement.style.display = "table-row";
            }//end first if block

            /*once i have filtered by conference, I have to deal with the division filter, so the filters can be stacked
            this code block only activates if the division filter is active*/
            if(!(divFilter === "None")){
                //this targets the next sibling of the current cell, ie the divCell td
                if(!(divFilter === cell.nextSibling.textContent)) {
                    //hide the whole row if the cell in the division column doesn't match the active divFilter
                    cell.parentElement.style.display = "none";
                }//end second if block
            }//end first if block
        });//end forEach
    }//end filterByLeague

    //this function is called every time the divFilter select box changes, its functionality is identical to filterByLeague
    //except for working on the cells with the class .divCell
    function filterByRegion(){
        divFilter = divisionSelect.value;
        //using let or const rather than var for variables and constants limits variables to their current scope, rather than global scope
        let divTds = document.querySelectorAll('.divCell');

        divTds.forEach(cell => {

            if (divFilter === "None") {
                cell.parentElement.style.display = "table-row";
            }
            else if (!(cell.textContent === divFilter)) {
                cell.parentElement.style.display = "none";
            }
            else if (cell.textContent === divFilter) {
                cell.parentElement.style.display = "table-row";
            }//end first if block

            if (!(confFilter === "None")) {
                //instead of targeting the next sibling of the current cell, I target the previous sibling to hit the confCell column
                if (!(confFilter === cell.previousSibling.textContent)) {
                    //hide the row if the confFilter doesn't match the content of the confCell column
                    cell.parentElement.style.display = "none";
                }
            }//end second if block
        });//end forEach
    }//end filterByRegion

    //this shows the whole table again if the user wants to reset the filters
    function resetRows(){
        //clear the select box
        conferenceSelect.value = "None";
        divisionSelect.value = "None";

        //set display from none to table-row, hiding these rows instead of deleting them, among other things
        //stops them from accidentally being repeated. it also makes it so I dont need to fetch data again
        rowList.forEach(row =>{
            row.style.display = "table-row";
        });

        //to clear the filter cache, I have to run the filter functions after the reset
        filterByLeague();
        filterByRegion();
    }//end resetRows

    //this function highlights a row that is clicked on with the goal of helping readability. Takes the clicked row as an argument
    function highlightRow(rowClicked){
        //set the highlight colour, I went with a light green
        let highlightColor = "#d1ecb2";

        //if the background of the row clicked is not already highlighted, highlight it
        if(!(rowClicked.bgColor === highlightColor)){
            rowClicked.bgColor = highlightColor;
        }
        //change the row background back to white if it is already highlighted
        else if (rowClicked.bgColor === highlightColor){
            rowClicked.bgColor="";
        }
    }//end of highlightRow function
}//end of main function

