window.addEventListener('load', initialize);

function initialize(){
    let resultBtn = document.querySelector('button');

    let effectH2 = document.querySelector("section h2");
    let effectP = document.querySelector("section p");
    let effectArea = document.querySelector("#fumbleDisplay");
    let displayArea = document.querySelector('#allDisplay');
    let rollOutput = document.querySelector("output");
    let seeAllLink = document.querySelector('#listLink');
    let method;

    resultBtn.addEventListener('click', setRoll);
    seeAllLink.addEventListener('click', setView);

    function setRoll(){
        method = "roll";
        getResult();
    }

    function setView() {
        method = "view";
        getResult();
    }

    function getResult() {

        fetch('./fumble1.json')
            .then(response =>{
                return response.json();
            })
            .then(data =>{

                if(method==="roll"){
                    assignFate(data);
                }
                else if(method === "view"){
                    seeAllEffects(data);
                }
            })
    }

    function seeAllEffects(data){


        displayArea.textContent = "";
        effectArea.style.display = "none";

       let newTable = document.createElement('table');

       let headerTr = document.createElement('tr');
       let rangeTh =document.createElement('th');
       rangeTh.textContent = "Die Range";
       let titleTh =document.createElement('th');
       titleTh.textContent = "Result";
       let effectTh =document.createElement('th');
       effectTh.textContent = "Description";

       headerTr.appendChild(rangeTh);
       headerTr.appendChild(titleTh);
       headerTr.appendChild(effectTh);

       newTable.appendChild(headerTr);


       data.effect.forEach(effect=>{
           let tr = document.createElement('tr');

               let rangeTd = document.createElement('td');
               let titleTd = document.createElement('td');
               let effectTd = document.createElement('td');

           if(effect.highest){
               rangeTd.textContent = `${effect.lowest} - ${effect.highest}`;
           }
           else{
               rangeTd.textContent = effect.lowest
           }

           titleTd.textContent = effect.expletive;
           effectTd.textContent = effect.result;

           tr.appendChild(rangeTd);
           tr.appendChild(titleTd);
           tr.appendChild(effectTd);
           newTable.appendChild(tr);

         });

        displayArea.appendChild(newTable);

    }

    function assignFate(data){

        displayArea.textContent = "";
        effectArea.style.display = "flex";

        let roll = Math.floor(Math.random() * 100 + 1);

        console.log(roll);

        data.effect.forEach(effect =>{

            if(!effect.highest && (roll === effect.lowest)){
                effectH2.textContent = effect.expletive;
                effectP.textContent = effect.result;
            }
            else if(effect.highest && (roll >= effect.lowest && roll <= effect.highest)){
                effectH2.textContent = effect.expletive;
                effectP.textContent = effect.result;
            }

            rollOutput.value = roll;
        })
    }
}
