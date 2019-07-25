//on the nfl.html file, I called this script asynchronously, so it would only run after the main page has loaded
// getData will be my main function and putting my code within this function will keep my variables out of the global scope
window.addEventListener('load', getData);

function getData() {

    let teamTable = document.querySelector('table');
    let conferenceSelect = document.querySelector('#conferenceSelect');
    let divisionSelect = document.querySelector('#divisionSelect');


    let jsonData;


    conferenceSelect.addEventListener('change', filterByLeague);
    divisionSelect.addEventListener('change', filterByRegion);

    document.querySelector('#resetFilters').addEventListener("click", resetRows);

    let confFilter = "None";
    let divFilter = "None";

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
            jsonData = teamData;
            showData(jsonData);
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
            confTd.className = "confCell";
            let divisionTd = document.createElement('td');
            divisionTd.textContent = team.division;
            divisionTd.className = "divCell";


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

    function filterByLeague(){

       confFilter = conferenceSelect.value;
       console.log(confFilter);
       let confTds = document.querySelectorAll(".confCell");

        confTds.forEach(cell =>{
            if (!(cell.textContent === confFilter)){
                cell.parentElement.style.display = "none";
            }
        })
    }

    function filterByRegion(){

        divFilter = divisionSelect.value;
        console.log(divFilter);
        let divTds = document.querySelectorAll(".divCell");

        divTds.forEach(cell =>{
            if (!(cell.textContent === divFilter)){
                cell.parentElement.style.display = "none";
            }
        })

    }

    function resetRows(){
        conferenceSelect.value = "None";
        divisionSelect.value = "None";
        rowList.forEach(row =>{
            row.style.display = "table-row";
        })
    }

    function highlightRow(rowClicked){

       let rowName= rowClicked.className;

       rowList.forEach(row =>{
           if(row.className === rowName && !(row.bgColor == 'palegreen')){
               row.bgColor = "palegreen";
           }
           else if (row.className === rowName && (row.bgColor == 'palegreen')){
               row.bgColor="";
           }
       })

    }
}

