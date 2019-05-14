function start(){
    let counter = 0;
    setInterval(() =>{

        changePic(counter);
        counter++;

        if (counter === 4) {
            counter = 0;
        }
    }, 5000);



}

function changePic(count){
    let imgArray = ['pics/cardgame.PNG', 'pics/heatmap.PNG', 'pics/dresdengame-titlepage.PNG','pics/electron.svg.png'];
    let descArray = ['<strong>Description:</strong> A simple higher or lower card game I programmed using the "Deck of Cards" api',
        '<strong>Description:</strong> An app that pulls current product recalls in Canada and displays them on a heat map',
        '<strong>Description:</strong> A fighting game I wrote in Java based on the book series "The Dresden Files" by Jim Butcher',
        '<strong>Description:</strong> A sample app I wrote using Electron.js'];

    let toolsArray = ['<strong>Tools used:</strong> HTML, CSS, Vanilla JavaScript, Materialize CSS library',
        '<strong>Tools used:</strong> HTML, CSS, Vanilla JavaScript',
        '<strong>Tools used:</strong> Java, written with Eclipse',
        '<strong>Tools used:</strong> Electron using Node, CSS, and Vanilla JavaScript'
    ];

    let workImg = document.querySelector('#workPreview');
    let btnLink = document.querySelector('#workLink');
    btnLink.href = `./work/work${count + 1}.html`;
    console.log(btnLink.href);
    let descriptionLi = document.querySelector('#descLi');
    let toolsUsedLi = document.querySelector('#toolsLi');

    console.log(toolsUsedLi);

    workImg.setAttribute('src', imgArray[count]);
    workImg.style.transition = "0.7s";

    descriptionLi.innerHTML = descArray[count];
    toolsUsedLi.innerHTML =  toolsArray[count];

}

window.addEventListener('load', start);