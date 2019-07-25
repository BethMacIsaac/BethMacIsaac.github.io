//on the nfl.html file, I called this script asynchronously, so it would only run after the main page has loaded
// getData will be my main function and putting my code within this function will keep my variables out of the global scope
window.addEventListener('load', getData);

function getData() {

    let teamTable = document.querySelector('table');

    let rowList;

    // fetch('http://delivery.chalk247.com/team_list/NFL.JSON?api_key=74db8efa2a6db279393b433d97c2bc843f8e32b0', {
    //     mode: 'no-cors'
    // })
    fetch('./acmedata.json')
        .then(response => {

            if (!response.ok){
                console.log(`unable to reach api ${response}`);
            }
            else{
               return response.json()
            }
        })
        .then(teamData =>{
            showData(teamData);
        });


    function showData(teamData){


        teamData.results.data.team.forEach(team =>{
            let newRow = document.createElement('tr');

            let cityTd = document.createElement('td');
            cityTd.textContent = team.name;
            let teamTd = document.createElement('td');
            teamTd.textContent = team.nickname;
            let confTd = document.createElement('td');
            confTd.textContent = team.conference;
            let divisionTd = document.createElement('td');
            divisionTd.textContent = team.division;


            newRow.className = team.nickname;
            newRow.addEventListener('click', ()=>{
                highlightRow(newRow);
            });
            newRow.appendChild(cityTd);
            newRow.appendChild(teamTd);
            newRow.appendChild(confTd);
            newRow.appendChild(divisionTd);

            teamTable.appendChild(newRow);
        });

        rowList = document.querySelectorAll('tr');

    }

    function highlightRow(rowClicked){

       let rowName= rowClicked.className;

       rowList.forEach(row =>{
           if(row.className === rowName){

               row.bgColor = "lightGreen";
           }
       })

    }
}

