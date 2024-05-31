var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userChosenColors = [];
var gameOver = false;

$(document).on("keydown", function (event) {

    if(event.key === 'Enter'){
        gameStart();
    }

    if (gameOver) {
        restartGame();
    }
});

function playAudio(type){
    switch(type){
        case "yellow":
            var yellow = new Audio("./sounds/yellow.mp3");
            yellow.play();
            break;
        case "green":
            var green = new Audio("./sounds/green.mp3");
            green.play();
            break;
        case "red":
            var red = new Audio("./sounds/red.mp3");
            red.play();
            break;
        case "blue":
            var blue = new Audio("./sounds/blue.mp3");
            blue.play();
            break;
        default:
            console.log(type);
            break;
    }
}

function newSequence(){
    return Math.floor(Math.random() * 4);
}

function setGamePattern(newPattern){
    gamePattern.push(buttonColors[newPattern]);
}

function animatePress(event, time){
    event.classList.add("pressed");
    setTimeout(function(){
        event.classList.remove("pressed");
        playAudio(event.id);
    }, time);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateAndDelay(element, time, delayTime){
    animatePress(element, time);
    await delay(delayTime);
}

async function playGamePattern(gamePattern) {
    for (var i = 0; i < gamePattern.length; i++) {
        await animateAndDelay($('#' + gamePattern[i])[0], 100, 1000); // Delay of 1 second
    }
}

function waitForUserClick(){
    return new Promise(resolve => {

        let clickHandled = false;

        $(".btn").one("click", function(e){

            if(!clickHandled){
                clickHandled = true;
                animatePress(e.target, 100);
                userChosenColors.push(e.target.id);
                resolve();
            }
        });

        setTimeout(()=>{
            if(!clickHandled){
                clickHandled = true;
                resolve();
            }
        }, 5000);
    });
}

async function userClickedPattern(){
    while(userChosenColors.length < gamePattern.length){
        await waitForUserClick();
    }
}

function checkAnswer(){
    for(var i = 0; i < gamePattern.length; i++){
        if(userChosenColors[i] !== gamePattern[i]){return true;}
    }
    return false;
}

async function game(){
        setGamePattern(newSequence());
        console.log(gamePattern);

        await playGamePattern(gamePattern);

        console.log("gamePattern ", gamePattern);

        userChosenColors.length = 0;
        console.log("userClickedPattern before ", userChosenColors);
        await userClickedPattern();
        console.log("userClickedPattern after ", userChosenColors);


        return new Promise(resolve => {
            gameOver = checkAnswer();
            resolve();
        });
}

async function gameStart(){
    while(!gameOver){
        $("h1").text("level "+ gamePattern.length);
        await game();
        if(gameOver){
            $("h1").text("Game Over, Press Any Key to Restart");
        }
    }
    console.log("gameOver");
}

async function restartGame() {
    $("h1").text("Restarting...");
    await delay(1000); // Add a delay for visual effect (optional)

    // Reset game variables
    gamePattern = [];
    userChosenColors = [];
    gameOver = false;

    // Start the game again
    gameStart();
}