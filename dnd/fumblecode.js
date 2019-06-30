window.addEventListener('load', initialize);

function initialize(){
    let resultBtn = document.querySelector('button');
    resultBtn.addEventListener('click', getResult);

    function getResult() {
        fetch('./fumble1.json')
            .then(response =>{
                return response.json();
            })
            .then(data =>{
                assignFate(data);
            })


    }

    function assignFate(data){

        let roll = Math.floor(Math.random() * 100 + 1);

        console.log(roll);

        data.effect.forEach(effect =>{

            if(!effect.highest && (roll == effect.lowest)){
                console.log(effect.expletive);
            }
            else if(effect.highest && (roll >= effect.lowest && roll <= effect.highest)){
                console.log(effect.expletive);
            }
        })
    }
}
