window.addEventListener("load", rollout);

function rollout() {
    let dieSelect = document.querySelector(".chooseDie");
    let diceInput = document.querySelector(".numberOfDice");
    let rollBtn = document.querySelector("#roll");
    let diceMax = parseInt(dieSelect.value);
    let diceArray = [];
    let totalRolled = 0;
    let diceNumber;

    dieSelect.addEventListener("change", getMax);
    diceInput.addEventListener("focus", resetValue);
    rollBtn.addEventListener("click", rollDice);

    function getMax(){
        diceMax = parseInt(dieSelect.value);
        // console.log(diceMax);
    }

    function resetValue() {
        diceInput.value = "";

    }
    function rollDice(){
        let diceSection = document.querySelector("#diceDisplay > div");
        totalRolled = 0;
        diceSection.innerHTML = "";

        diceNumber = diceInput.value;

        for (let counter = 0; counter < diceNumber; counter++){

            rollValue = Math.floor(Math.random() * diceMax + 1);
            totalRolled += rollValue;

            let die = document.createElement("output");
            die.setAttribute("class", "die");
            die.value = rollValue;

            diceArray.push(die);//save this for later functionality

            diceSection.appendChild(die);

        }

        document.querySelector("#total").value = totalRolled;

    }



}