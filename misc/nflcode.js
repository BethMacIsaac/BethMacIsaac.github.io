//on the nfl.html file, I called this script asynchronously, so it would only run after the main page has loaded
// getData will be my main function and putting my code within this function will keep my variables out of the global scope
window.addEventListener('load', getData);

function getData() {

    fetch('http://delivery.chalk247.com/team_list/NFL.JSON?api_key=74db8efa2a6db279393b433d97c2bc843f8e32b0')
        .then(response => response.json)
        .then(teamData =>{
            console.log(teamData);
        })

}