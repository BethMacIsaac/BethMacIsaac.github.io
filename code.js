function start(){
    let counter = 0;
    setInterval(function(){

        changePic(counter);
        counter++;

        if (counter === 3) {
            counter = 0;
        }
    }, 5000);



}

function changePic(count){
    let imgArray = ['pics/cardgame.png', 'pics/heatmap.png', 'pics/dresdengame-titlepage.PNG' ];
    let descArray = ['<strong>Description:</strong> A simple higher or lower card game I programmed using the "Deck of Cards" api',
        '<strong>Description:</strong> An app that pulls current product recalls in Canada and displays them on a heat map',
        '<strong>Description:</strong> A fighting game I wrote in Java based on the book series "The Dresden Files" by Jim Butcher'];

    let toolsArray = ['<strong>Tools used:</strong> HTML, CSS, Vanilla JavaScript, Materialize CSS library',
        '<strong>Tools used:</strong> HTML, CSS, Vanilla JavaScript',
        '<strong>Tools used:</strong> Java, written with Eclipse'];

    let workImg = document.querySelector('#workPreview');
    let descriptionLi = document.querySelector('#descLi');
    let toolsUsedLi = document.querySelector('#toolsLi');

    console.log(toolsUsedLi);
    // let picCount = 0;

    // count++;
    // console.log(imgArray[count]);


    workImg.setAttribute('src', imgArray[count]);
    descriptionLi.innerHTML = descArray[count];
    toolsUsedLi.innerHTML =  toolsArray[count];


}

window.addEventListener('load', start);