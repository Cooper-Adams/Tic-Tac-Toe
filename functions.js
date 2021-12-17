//Player factory. Generates player objects.
const playerFactory = (marker) => {
    this.marker = marker;
    return {marker};
}

//Module for the gameboard. Has functions to create the board, set a marker
//on the board, and clear the board.
const gameBoard = (() => {
    
    //Empty array of size 9, to represent the onscreen Tic Tac Toe board.
    let Board = Array.from(' '.repeat(9));

    //Takes in a position and the current marker, then places that marker
    //at that position on the board.
    function setMarker(position, marker)
    {
        Board[position] = marker;
    }

    function getMarker(position)
    {
        return Board[position];
    }

    //Empties the board so a new game can be initiated.
    function clearBoard()
    {
        for (let i = 0; i < Board.length; ++i)
        {
            Board[i] = " ";
        }
    }

    return {setMarker, clearBoard, getMarker};
}) ();

//Gameflow module. Contains all the logic of progressing and ending the game.
const gameFlow = (() => {
    //Move counter in case of tie
    let movesMade = 0;
    //Gameover status for when the game ends (win or tie)
    let endOfGame = false;

    let easyAIDif = false;
    let hardAIDif = false;

    //Players will be X and O, with X always going first
    let playerOne = playerFactory('X');
    let playerTwo = playerFactory('O');

    //Setting player X as first
    let currentPlayer = Object.assign(playerOne);

    function typeOfAI()
    {
        if (easyAIDif == true)
        {
            return "Easy";
        }

        else if (hardAIDif == true)
        {
            return "Hard";
        }

        else
        {
            return "None";
        }
    }

    //This function contains the logic for the AI when set to Easy difficulty.
    function easyAI()
    {
        while (movesMade != 9)
        {
            let position = Math.floor(Math.random() * 9);

            let result = checkPosition(position);

            if (result == " ")
            {
                continue;
            }

            else if (endOfGame == true)
            {
                break;
            }

            else
            {
                let result = checkForWin(position, 'O');
                displayController.placeAIMarker('O', position, result);

                currentPlayer = Object.assign(playerOne);
                break;
            }
        }
    }

    //This function is called when the Player V Player or Player V AI button
    //is clicked, and it sets the logic variables to their default states.
    function resetLogic(typeOfAI)
    {
        if (typeOfAI == "Easy") 
        {
            easyAIDif = true;
            hardAIDif = false;
        }

        else if (typeOfAI == "Hard")
        {
            easyAIDif = false;
            hardAIDif = true;
        }

        else
        {
            easyAIDif = false;
            hardAIDif = false;
        }

        endOfGame = false;
        movesMade = 0;
        currentPlayer = Object.assign(playerOne);
    }

    //Checks if the positon selected by the user is free or if the game is
    //over, and if not it sets the players marker in that position.
    function checkPosition(position)
    {
        if (gameBoard.getMarker(position) != " ")
        {
            return " ";
        }

        else if (endOfGame == true)
        {
            return "gameOver";
        }

        else
        {
            movesMade++;
            gameBoard.setMarker(position, currentPlayer.marker);

            return currentPlayer.marker;
        }
    }

    //Checks if the last marker placed has won the game.
    function checkForWin(position, marker)
    {
        if (movesMade == 9)
        {
            return "TIE";
        }

        //If no tie, checks for a horizontal win
        else if (checkHorizontal(position, marker))
        {
            if (currentPlayer.marker == 'X')
            {
                currentPlayer = Object.assign(playerTwo);
                return "P1";
            }

            else
            {
                currentPlayer = Object.assign(playerOne);
                return "P2";
            }
        }

        //Then, checks for a vertical win
        else if (checkVertical(position, marker))
        {
            if (currentPlayer.marker == 'X')
            {
                currentPlayer = Object.assign(playerTwo);
                return "P1";
            }

            else
            {
                currentPlayer = Object.assign(playerOne);
                return "P2";
            }
        }

        //Then, checks for a diagonal win
        else if (checkDiagonal(position, marker))
        {
            if (currentPlayer.marker == 'X')
            {
                currentPlayer = Object.assign(playerTwo);
                return "P1";
            }

            else
            {
                currentPlayer = Object.assign(playerOne);
                return "P2";
            }
        }

        //Updates the currentPlayer and then returns 'nowin' if the last 
        //move did not result in a win.
        else
        {
            if (currentPlayer.marker == 'X')
            {
                currentPlayer = Object.assign(playerTwo);  
            }

            else
            {
                currentPlayer = Object.assign(playerOne);
            }

            return "nowin";
        }
    }

    //Takes the last placed marker, and from that position, tries to find
    //an instance where there are 3 of that mark in a row horizontally.
    function checkHorizontal(pos, mark)
    {
        //If the mark is in the left column, check to the right
        if (pos == 0 || pos == 3 || pos == 6)
        {
            if (gameBoard.getMarker(parseInt(pos) + 1) == mark)
            {
                if (gameBoard.getMarker(parseInt(pos) + 2) == mark)
                {
                    endOfGame = true;
                    return true;
                }
            }
            
            return false;
        }

        //If the mark is in the middle column, check left and right
        else if (pos == 1 || pos == 4 || pos == 7)
        {
            if (gameBoard.getMarker(parseInt(pos) - 1) == mark)
            {
                if (gameBoard.getMarker(parseInt(pos) + 1) == mark)
                {
                    endOfGame = true;
                    return true;
                }
            }
            
            return false;
        }

        //If the mark is in the right column, check to the left
        else if (pos == 2 || pos == 5 || pos == 8)
        {
            if (gameBoard.getMarker(parseInt(pos) - 1) == mark)
            {
                if (gameBoard.getMarker(parseInt(pos) - 2) == mark)
                {
                    endOfGame = true;
                    return true;
                }
            }
            
            return false;
        }
    }

    function checkVertical(pos, mark)
    {
        //If the mark is in the top row, check below in the column
        if (pos == 0 || pos == 1 || pos == 2)
        {
            if (gameBoard.getMarker(parseInt(pos) + 3) == mark)
            {
                if (gameBoard.getMarker(parseInt(pos) + 6) == mark)
                {
                    endOfGame = true;
                    return true;
                }
            }
            
            return false;
        }

        //If the mark is in the middle row, check above and below
        else if (pos == 3 || pos == 4 || pos == 5)
        {
            console.log(gameBoard.getMarker(pos + 3))

            if (gameBoard.getMarker(parseInt(pos) - 3) == mark)
            {
                if (gameBoard.getMarker(parseInt(pos) + 3) == mark)
                {
                    endOfGame = true;
                    return true;
                }
            }
            
            return false;
        }

        //If the mark is in the bottom row, check above in the column
        else if (pos == 6 || pos == 7 || pos == 8)
        {
            if (gameBoard.getMarker(parseInt(pos) - 3) == mark)
            {
                if (gameBoard.getMarker(parseInt(pos) - 6) == mark)
                {
                    endOfGame = true;
                    return true;
                }
            }
            
            return false;
        }
    }

    function checkDiagonal(pos, mark)
    {
        //If the marker placed is in the middle of the board, check both
        //diagonals.
        if(pos == 4)
        {
            //Checks the diagonal from the top left to the bottom right.
            if (gameBoard.getMarker(parseInt(pos) - 4) == mark)
            {
                if (gameBoard.getMarker(parseInt(pos) + 4) == mark)
                {
                    endOfGame = true;
                    return true;
                }
            }

            //Checks the diagonal from the top right to the bottom left.
            if (gameBoard.getMarker(parseInt(pos) - 2) == mark)
            {
                if (gameBoard.getMarker(parseInt(pos) + 2) == mark)
                {
                    endOfGame = true;
                    return true;
                }
            }

            return false;
        }

        //If the marker placed is in the bottom right of the board, check
        //the top left to bottom right diagonal.
        else if (pos == 8)
        {
            if (gameBoard.getMarker(parseInt(pos) - 4) == mark)
            {
                if (gameBoard.getMarker(parseInt(pos) - 8) == mark)
                {
                    endOfGame = true;
                    return true;
                }
            }

            return false;
        }

        //If the marker placed is in the top left of the board, check
        //the top left to bottom right diagonal.
        else if (pos == 0)
        {
            if (gameBoard.getMarker(parseInt(pos) + 4) == mark)
            {
                if (gameBoard.getMarker(parseInt(pos) + 8) == mark)
                {
                    endOfGame = true;
                    return true;
                }
            }

            return false;
        }

        //If the marker placed is in the top right of the board, check
        //the top right to bottom left diagonal.
        else if (pos == 2)
        {
            if (gameBoard.getMarker(parseInt(pos) + 2) == mark)
            {
                if (gameBoard.getMarker(parseInt(pos) + 4) == mark)
                {
                    endOfGame = true;
                    return true;
                }
            }

            return false;
        }

        //If the marker placed is in the bottom left of the board, check
        //the top right to bottom left diagonal.
        else if (pos == 6)
        {
            if (gameBoard.getMarker(parseInt(pos) - 2) == mark)
            {
                if (gameBoard.getMarker(parseInt(pos) - 4) == mark)
                {
                    endOfGame = true;
                    return true;
                }
            }

            return false;
        }

        return false;
    }

    return {checkPosition, checkForWin, resetLogic, typeOfAI, easyAI};
}) ();

const displayController = (() => {

    //Identifies the message display so it can be updated.
    let display = document.querySelector('.messageDisplay');

    //Identifies all squares in the gameboard.
    let boardSquares = Array.from(document.querySelectorAll('.square'));

    //Adds on click event listeners to each square that are attatched to
    //the placeMarker function, giving basic game functionality.
    boardSquares.forEach(square => {
        square.addEventListener('click', placeMarker);
    });

    //clearBoard is called after the board has been reset in the gameBoard
    //object, and it clears the onscreen board of it's contents.
    function clearBoard()
    {
        for (let i = 0; i < 9; ++i)
        {
            boardSquares[i].textContent = gameBoard.getMarker(i);
        }

        updateDisplay("O", "nowin");
    }

    //This function takes in the last player to play and the winner if the 
    //last player won. This is to avoid a second call to checkForWin. If
    //nobody has won and there is no tie, the function identifies the last 
    //player and updates the display to prompt the next player for their move.
    function updateDisplay(marker, winner)
    {
        if (winner == "P1")
        {
            display.textContent = "Player X wins!";
        }

        else if (winner == "P2")
        {
            display.textContent = "Player O wins!";
        }

        else if (winner == "TIE")
        {
            display.textContent = "It's a tie. Nobody wins!";
        }

        else
        {
            if (marker == "X")
            {
                display.innerHTML = "Player O's turn."
            }

            else
            {
                display.innerHTML = "Player X's turn.";
            }
        }
    }

    //After the AI chooses its spot in the gameFlow object, this function
    //will place that marker in the corresponding spot on the display.
    function placeAIMarker(marker, position, result)
    {
        boardSquares[position].textContent = marker;
        updateDisplay('O', result)
    }

    //Calls the checkPosition function in the gameFlow object and places 
    //the return from it if said return is X or O.
    function placeMarker(e)
    {
        let marker = gameFlow.checkPosition(e.target.id);

        if (marker == "X" || marker == "O")
        {
            boardSquares[e.target.id].textContent = marker;

            let result = gameFlow.checkForWin(e.target.id, marker);

            updateDisplay(marker, result);

            if (gameFlow.typeOfAI() == "Easy")
            {
                gameFlow.easyAI();
            }
        }

        else
        {
            return;
        }
    }

    //Button to play Player vs Player. Wipes the board clean so the players
    //can play again, or switches functionality away from the AI as player 2.
    const pvpButton = document.querySelector('.vsPlayer');
    pvpButton.addEventListener('click', function() 
    {
        //Calls clearBoard in the gameBoard object, then calls the local
        //displayController clearBoard to match.
        gameBoard.clearBoard();
        clearBoard();
        gameFlow.resetLogic("none");
    })

    //Button to play against the AI.
    const pvAIButton = document.querySelector('.vsAI');
    pvAIButton.addEventListener('click', function() 
    {
        //Calls clearBoard in the gameBoard object, then calls the local
        //displayController clearBoard to match.
        gameBoard.clearBoard();
        clearBoard();
        gameFlow.resetLogic("Easy");
    })

    return {placeAIMarker};
}) ();