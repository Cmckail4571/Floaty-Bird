// Created by Callum Mckail
// Created on 03-26-2022
// Description: JavaScript for Flappy Bird SVG game. Manipulates the DOM, Manages game state, Sets up and tracks player controls and inputs, Controls animations for on screen elements of the game. 
window.addEventListener("load", function () {

    let gameover = false
    // Returns rect element that is used as the pipe in game
    let pipe = document.getElementById("pipe")
    // Returns rect element that is used as the hole in game
    let hole = document.getElementById("hole")
    // Mask rect that defines the visible section of the Pipe rect
    let visible = document.getElementById("visible")
    // Mask rect that defines the hidden section of the Pipe rect
    let invisible = document.getElementById("invisible")
    // Counter used to track how many Pipes have passed through the player view
    let pipeCounter = 0
    // Returns circle element that is used as the bird in game
    let bird = document.getElementById("bird")
    // Returns rect element that is used as the grass/ground in game
    let grass = document.getElementById("grass")
    // Returns rect element that is used as the start/play again button in game
    let start = document.getElementById("start")
    // Returns text element that is used as the score display in game
    let scoreText = document.getElementById("score")
    // Counter that keeps track of the player score
    let score = 0
    // Returns an array of button elements that are used as the difficulty selectors
    let gameButtons = document.getElementsByClassName("difficultyButton")
    // Returns text element that is used as the text for the start rect
    let startText = document.getElementById("startText")
    // Interval value used to determine how fast/slow the game runs
    let gameInterval = 30

    /**
     * Used to animate the Pipe scrolling towards the player in game.
     * Determines the location of the pipe, hole, visible, and invisible elements
     */
    function pipeScroll() {
        // provides the current x value of the pipe, hole, invisible, and visible elements using the pipe *The elements all have the same current x value so we only need to return the x of one element*
        const location = parseInt(pipe.getAttribute("x"))
        // decides the random y value of the hole and invisible elements
        let holeY = (Math.random() * 200)

        // Checks if the location of elements is still in the player view and moves the x of all elements by -3 if true 
        // resets the x value of all attributes and sets a new random y value for the hole and invisible is false   
        if (location > -50) {
            pipe.setAttribute("x", location - 3);
            hole.setAttribute("x", location - 3);
            invisible.setAttribute("x", location - 3);
            visible.setAttribute("x", location - 3);
        } else {
            pipe.setAttribute("x", 750)
            hole.setAttribute("y", holeY)
            visible.setAttribute("x", 750)
            invisible.setAttribute("y", holeY)
            pipeCounter++
            console.log(pipeCounter + " pipes passed")
        }
    }

    /**
     * Increases the y value of the bird by 3 pixles
     * used to simulate the bird falling while no user input is present
     */
    function birdDrop() {
        // Returns the y value of the circle used as the bird
        const location = parseInt(bird.getAttribute("cy"))

        // Checks the location of the bird so that it cannot fall out of player view
        if (location < 350) {
            bird.setAttribute("cy", location + 3);
        }
    }

    /**
     * Decreases the y value of the circle used as the bird
     * Used to simulate flying or moving upward on the screen
     */
    function birdFly() {
        // Returns the y value of the circle used as the bird
        const location = parseInt(bird.getAttribute("cy"))
        
        // Checks the location of the bird so that it cannot fly out of player view
        if (location > 30) {
            bird.setAttribute("cy", location - 30);
        }
    }

    /**
     * Generates and sets SVG elements and attributes when the game is over
     */
    function gameOver() {
        const svgNS = "http://www.w3.org/2000/svg";
        console.log("gameOver")

        // Creates the game over text on screen
        let gameOverText = document.createElementNS(svgNS, "text");
        gameOverText.setAttribute("id", "gameOver");
        gameOverText.setAttribute("x", "320");
        gameOverText.setAttribute("y", "200");
        gameOverText.setAttribute("font-size", "30");
        gameOverText.innerHTML = "Game Over!"

        // Sets the attributes for the Start button
        start.setAttribute("x", "345");
        start.setAttribute("y", "220");
        start.setAttribute("width", "100");
        start.setAttribute("height", "50");
        start.setAttribute("rx", "15");

        // Sets the attributes for the start button text
        startText.setAttribute("x", "358");
        startText.setAttribute("y", "250");
        startText.innerHTML = "Play Again?"

        // appends and/or displays all the elements on screen
        gameWindow.appendChild(gameOverText);
        startText.style.display = "block"
        start.style.display = "block"
    }

    /**
     * Checks if the bird has colided with the ground and changes state to gameover if true
     */
    function groundCollision() { 
        // Gets the y value of the circle used for the bird
        const birdY = parseInt(bird.getAttribute("cy"))
        // Gets the r value of the circle used for the bird
        const birdR = parseInt(bird.getAttribute("r"))
        // Gets the y value of the rectangle used for the grass/ground
        const grassY = parseInt(grass.getAttribute("y"))
        
        // Checks the y location of the bird compared to the y location of the grass
        if (birdY + birdR >= grassY) {
            gameover = true
        }
    }

    /**
     * Checks if the bird has colided with the pipe and changes the state to gameover if true
     * Also checks if the user made it through a pipe and increases the score if true
     */
    function pipeCollision() {
        // gets the x attribute of the bird
        const birdX = parseInt(bird.getAttribute("cx"))
        // gets the y attribute of the bird
        const birdY = parseInt(bird.getAttribute("cy"))
        // gets the x attribute of the pipe
        const pipeX = parseInt(pipe.getAttribute("x"))
        // gets the width attribute of the pipe
        const pipeW = parseInt(pipe.getAttribute("width"))
        // gets the height attribute of the hole
        const holeH = parseInt(hole.getAttribute("height"))
        // gets the y attribute of the hole
        const holeY = parseInt(hole.getAttribute("y"))

        // Checks locations that would cause the game to end and changes state to gameover if true
        if ((birdX >= pipeX && birdX <= pipeX + pipeW && birdY <= holeY) || (birdX >= pipeX && birdX <= pipeX + pipeW && birdY > holeY + holeH)) {
            gameover = true
        // Checks the location of the bird and the pipe count to increase the score if the player makes it through a pipe
        } else if (birdX >= pipeX + pipeW && birdY > holeY && birdY < holeY + holeH && score <= pipeCounter) {
            score++
            scoreText.innerHTML = score
        }
    }

    /**
     * Starts the game by running required functions on an interval if state is not gameover
     */
    function runGame() {
        gameover = false

        // Disables the difficulty buttons so they can not be pressed and interfere with the gameplay mid game
        for (i = 0; i < gameButtons.length; i++) {
            console.log("loop started")
            gameButtons[i].setAttribute("disabled", "true")
        }

        // sets up the interval for running the game functions
        const gameActivity = setInterval(function () {
            groundCollision()
            pipeCollision()
            //checks game state, if true calls the required functions if false clears the interval and calls gameOver()
            if (!gameover) {
                pipeScroll()
                birdDrop()
            } else {
                clearInterval(gameActivity);
                gameOver()
                console.log("Game is over")
            }
        }, gameInterval)
    }

    /**
     * Resets the game to its default state
     */
    function gameReset() {
        // resets pipeCounter to 0
        pipeCounter = 0
        // resets score to 0
        score = 0
        // sets the scoreText to 0
        scoreText.innerHTML = score

        // Resets the position of the bird, pipe, and hole
        bird.setAttribute("cy", 200);
        pipe.setAttribute("x", 750);
        hole.setAttribute("x", 750);
        
        // Hides the start button and button text
        start.style.display = "none"
        startText.style.display = "none"
        
        // checks if state is gameover and removes the gameover text if true
        if (gameover) {
            document.getElementById("gameWindow").removeChild(document.getElementById("gameOver"))
        }
        // calls runGame() function to start the game again
        runGame()
    }

    // Returns the p element that holds difficulty notes
    let notes = document.getElementById("notes")

    // Loops through all game buttons anf adds an event listener to each one
    for (i = 0; i < gameButtons.length; i++) {
        gameButtons[i].addEventListener('click', function (event) {
            // Checks the button that was pressed
            if (event.target.innerHTML == "Easy") {
                // Sets the game interval
                gameInterval = 30
                // Sets the html for the p element that holds difficulty notes
                notes.innerHTML = "Easy: Slow play speed, easy to navigate pipes"
                // Adds the id for styling the selected button to button 0 and removes it from the other 2 buttons
                gameButtons[0].setAttribute("id", "selectedButton")
                gameButtons[1].removeAttribute("id")
                gameButtons[2].removeAttribute("id")
            } else if (event.target.innerHTML == "Medium") {
                // Sets the game interval
                gameInterval = 20
                // Sets the html for the p element that holds difficulty notes
                notes.innerHTML = "Medium: Comfortable play speed, makes navigating pipes more difficult!"
                // Adds the id for styling the selected button to button 1 and removes it from the other 2 buttons
                gameButtons[1].setAttribute("id", "selectedButton")
                gameButtons[0].removeAttribute("id")
                gameButtons[2].removeAttribute("id")
            } else {
                // Sets the game interval
                gameInterval = 15
                // Sets the html for the p element that holds difficulty notes
                notes.innerHTML = "Hard: FAST play speed, makes it much harder to navigate pipes!"
                // Adds the id for styling the selected button to button 2 and removes it from the other 2 buttons
                gameButtons[2].setAttribute("id", "selectedButton")
                gameButtons[0].removeAttribute("id")
                gameButtons[1].removeAttribute("id")
            }
        });
    }

    // Event listener for a click on the start button. calls gameReset() to start the game
    start.addEventListener("click", gameReset)

    // Event listener looking for a keypress, checks if the state is not gameover and if the keypress is a Spacebar and calls birdFly() if true
    document.addEventListener("keypress", function(event) {
        if (!gameover && event.code == "Space") {
            birdFly()
        }
    })

})