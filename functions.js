//Player factory. Generates player objects.
const playerFactory = (marker) => {
    this.marker = marker;
    return {marker};
}

//Module for the gameboard. Contains an array that houses the player's choices,
//a function to get the marker at a position, a function to set a marker at
//a position, a function to clear the board, and a function to find all empty
//spots.
const gameBoard = (() => {
    
    //Empty array of size 9, to represent the onscreen Tic Tac Toe board.
    let Board = Array(9).fill(" ");

    //Takes in a position and the current marker, then places that marker
    //at that position on the board.
    function setMarker(position, marker)
    {
        Board[position] = marker;
    }

    //Returns the marker at the specified position.
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

    //Finds the indexes of the empty spots on the board and returns them.
    function getEmpty()
    {
        empty = [];

        for (let i = 0; i < Board.length; ++i) 
        {
            if (Board[i] == " ") 
            {
                empty.push(i);
            }
        }

        return empty;
    }

    return {setMarker, clearBoard, getMarker, getEmpty};
}) ();

//Gameflow module. Contains all the logic of progressing and ending the game.
const gameFlow = (() => {
    //Logic variables for the AI
    let easyAIDif = false;
    let medAIDif = false;
    let hardAIDif = false;
    let impsAIDif = false;

    //Players will be X and O, with X always going first
    let playerOne = playerFactory('X');
    let playerTwo = playerFactory('O');

    //Setting player X as first
    let currentPlayer = Object.assign(playerOne);
    
    /**
     * Identifies the current player and swaps to the other.
     * 
     * @return {void}
     */
    function updatePlayer()
    {
        if (currentPlayer.marker == "X")
        {
            currentPlayer = Object.assign(playerTwo);
        }

        else
        {
            currentPlayer = Object.assign(playerOne);
        }
    }

    /**
     * Returns the current AI Difficulty if one is active.
     * 
     * @return {string} The type of AI that is active.
     */
    function typeOfAI()
    {
        if (easyAIDif == true)
        {
            return "Easy";
        }

        else if (medAIDif == true)
        {
            return "Medium";
        }

        else if (hardAIDif == true)
        {
            return "Hard";
        }

        else if (impsAIDif == true)
        {
            return "Impossible";
        }

        else
        {
            return "None";
        }
    }

    /**
     * Chooses a random legal spot on the board for the AI to play and then
     * updates the current player to be player O.
     * 
     * @return {void}
     */
    function easyAI()
    {
        currentPlayer = Object.assign(playerTwo);

        while (true)
        {
            let position = Math.floor(Math.random() * 9);

            let result = checkPosition(position);

            if (result == " ")
            {
                continue;
            }

            else if (checkForDraw())
            {
                break;
            }

            else
            {
                let result = checkForWin();
                displayController.placeAIMarker('O', position, result);

                currentPlayer = Object.assign(playerOne);
                break;
            }
        }
    }

    /**
     * This function is called when the AI difficulty is set to medium.
     * Has a 45% chance to make the best move possible when called.
     * Otherwise, reverts to easyAI logic.
     * 
     * @return {void}
     */
    function mediumAI()
    {
        let probability = Math.floor(Math.random() * 100);

        if (probability <= 45)
        {
            updatePlayer();
            let choice = bestMove();

            let result = checkPosition(choice);

            result = checkForWin();

            displayController.placeAIMarker('O', choice, result);
            currentPlayer = Object.assign(playerOne);
        }

        else
        {
            easyAI();
        }
    }

    /**
     * This function is called for when the hard AI is selected.
     * Has a higher chance than the medium AI to make the best move possible
     * when called. Otherwise, reverts to easyAI logic.
     * 
     * @return {void}
     */
    function hardAI()
    {
        let probability = Math.floor(Math.random() * 100);

        if (probability <= 65)
        {
            updatePlayer();
            let choice = bestMove();

            let result = checkPosition(choice);

            result = checkForWin();

            displayController.placeAIMarker('O', choice, result);
            currentPlayer = Object.assign(playerOne);
        }

        else
        {
            easyAI();
        }
    }

    /**
     * This function is called for when the impossible AI is selected.
     * Makes use of the MiniMax algorithm to choose the best available
     * spot on the board for the AI to play. Functionally impossible to beat.
     * 
     * @return {void}
     */
    function impossibleAI()
    {
        updatePlayer();
        let choice = bestMove();

        let result = checkPosition(choice);

        //Check for win and place on screen.
        result = checkForWin();

        displayController.placeAIMarker('O', choice, result);
        currentPlayer = Object.assign(playerOne);
    }

    /**
     * Using the MiniMax algorithm, this function will return the best
     * available spot on the board for the AI to play.
     * 
     * @return {number} The index of the best possible move.
     */
    function bestMove()
    {
        const empty = gameBoard.getEmpty();

        let bestMoveIndex;
        let bestMoveScore = -Infinity;
        let moveScore;

        empty.forEach((index) => 
        {
            //Place marker and recurse
            gameBoard.setMarker(index, 'O');
            moveScore = MiniMax(0, -Infinity, Infinity, false);

            gameBoard.setMarker(index, " ");
        
            if (moveScore > bestMoveScore) 
            {
                bestMoveScore = moveScore;
                bestMoveIndex = index;
            }
        });

        return bestMoveIndex;
    }

    /**
     * Returns a score based on the ending state of the board. If the
     * maximizing player O (the AI) won, a positive score is returned based
     * on the depth of the move. If the minimizing player X (human) won,
     * A negative score is returned based on the depth of the move. If the 
     * game resulted in a tie, a score of 0 is returned. The depth is used
     * to differentiate between possible states, as a state with a lower depth
     * will win faster, giving it a higher playing priority.
     *
     * @param {string} result The winner based on the last MiniMax move
     * @param {number} depth The current depth of the MiniMax recurse.
     * @return {number} The score of the game state.
     */
    function staticEvaluation(result, depth)
    {
        if (result == 'O')
        {
            return 100 - depth;
        }

        else if (result == 'X')
        {
            return -100 + depth;
        }

        else if (result == 'TIE')
        {
            return 0;
        }
    }

    /**
     * Function that makes use of the MiniMax algorithm as well as Alpha-Beta
     * pruning for efficiency and accuracy. Identifies what the best consecutive
     * move would be for each possible state of the board for each player. That
     * state is then given a score in staticEvaluation();
     *
     * @param {number} depth How deep the search is into the game state.
     * @param {number} alpha -Infinity, for pruning comparison
     * @param {number} beta  Infinity, for pruning comparison
     * @param {boolean} maxPlayer If true, it is the maximizing player, else minimizing.
     * @return {number} The score of the terminal game state.
     */
    function MiniMax(depth, alpha, beta, maxPlayer)
    {
        const roundResult = checkForWin();
        if (roundResult !== "nowin") 
        {
            return staticEvaluation(roundResult, depth);
        }

        // If it's not an ending state, continue minimax recursion
        const emptySquares = gameBoard.getEmpty();

        let moveScore;

        //Maximizing turn: The AI or Player O
        if (maxPlayer)
        {
            let bestMoveScore = -Infinity;

            emptySquares.some((index) => 
            {
                //Place Marker and recurse
                gameBoard.setMarker(index, 'O');
                moveScore = MiniMax(depth + 1, alpha, beta, false);
                //Remove marker
                gameBoard.setMarker(index, " ");

                bestMoveScore = Math.max(bestMoveScore, moveScore);
                // Alpha-beta pruning
                alpha = Math.max(alpha, bestMoveScore);
                if (alpha >= beta) return true; // Prune this branch (stops evaluating other empty squares)
            });

            return bestMoveScore;
        } 
        
        else 
        {
            // Minimizing turn
            let bestMoveScore = Infinity;

            emptySquares.some((index) => 
            {
                //Place marker and recurse
                gameBoard.setMarker(index, 'X');
                moveScore = MiniMax(depth + 1, alpha, beta, true);
                //Remove marker
                gameBoard.setMarker(index, " ");

                bestMoveScore = Math.min(bestMoveScore, moveScore);
                // Alpha-beta pruning
                beta = Math.min(beta, bestMoveScore);
                if (alpha >= beta) return true; // Prune this branch (stops evaluating other empty squares)
            });
        
            return bestMoveScore;
        }
    }

    /**
     * Depending on what AI the user has chosen, the function will update
     * gameFlow's AI logic variables to match.
     *
     * @param {string} typeOfAI The user selected AI difficulty.
     */
    function resetLogic(typeOfAI)
    {
        if (typeOfAI == "Easy") 
        {
            easyAIDif = true;
            medAIDif = false;
            hardAIDif = false;
            impsAIDif = false;
        }

        else if (typeOfAI == "Medium")
        {
            easyAIDif = false;
            medAIDif = true;
            hardAIDif = false;
            impsAIDif = false;
        }

        else if (typeOfAI == "Hard")
        {
            easyAIDif = false;
            medAIDif = false;
            hardAIDif = true;
            impsAIDif = false;
        }

        else if (typeOfAI == "Impossible")
        {
            easyAIDif = false;
            medAIDif = false;
            hardAIDif = false;
            impsAIDif = true;
        }

        else
        {
            easyAIDif = false;
            medAIDif = false;
            hardAIDif = false;
            impsAIDif = false;
        }

        currentPlayer = Object.assign(playerOne);
    }

    /**
     * Checks if the position passed in is available, and if so places it
     * in the gameBoard array.
     *
     * @param {number} position The AI or User selected spot to play
     * @return {String} Player's marker if successful, else blank if occupied
     *  or gameOver if a draw.
     */
    function checkPosition(position)
    {
        if (gameBoard.getMarker(position) != " ")
        {
            return " ";
        }

        else if (checkForDraw())
        {
            return "gameOver";
        }

        else
        {
            gameBoard.setMarker(position, currentPlayer.marker);

            return currentPlayer.marker;
        }
    }

    /**
     * Checks if every spot in the gameBoard array is filled.
     *
     * @return {boolean} If an empty spot is found return false, else true.
     */
    function checkForDraw()
    {
        for (let i = 0; i < 9; ++i)
        {
            if (gameBoard.getMarker(i) == " ")
            {
                return false;
            }
        }

        return true;
    }

    /**
     * Makes use of checkHorizontal, checkVertical, and checkDiagonal to
     * determine whether player X or O has won the game.
     *
     * @return {String} Returns the winning player's mark, or "TIE" if a tie,
     * or "nowin" if no win or tie is found.
     */
    function checkForWin()
    {
        //Checks rows first
        let result = checkHorizontal();
        if (result == 'X') return 'X';
        else if (result == 'O') return 'O';

        //Then checks the columns
        result = checkVertical();
        if (result == 'X') return 'X';
        else if (result == 'O') return 'O';

        //Then checks the diagonals
        result = checkDiagonal();
        if (result == 'X') return 'X';
        else if (result == 'O') return 'O';
        
        //Then checks for a draw
        else if (checkForDraw()) return 'TIE';

        //Otherwise returns nowin
        else return 'nowin';
    }

    /**
     * Checks if any row has three of the same mark.
     *
     * @return {String} Returns the winning player's mark or "nowin" if
     * no win is found.
     */
    function checkHorizontal()
    {
        for (let i = 0; i < 3; ++i) 
        {
            let row = [];

            for (let j = i * 3; j < i * 3 + 3; ++j) 
            {
                row.push(gameBoard.getMarker(j));
            }

            if (row.every(square => square == 'X')) 
            {
                return 'X';
            }

            else if (row.every(square => square == 'O'))
            {
                return 'O';
            }
        }

        return 'nowin';
    }

    /**
     * Checks if any column has three of the same mark.
     *
     * @return {String} Returns the winning player's mark or "nowin" if
     * no win is found.
     */
    function checkVertical()
    {
        for (let i = 0; i < 3; ++i) 
        {
            let column = [];

            for (let j = 0; j < 3; ++j) 
            {
                column.push(gameBoard.getMarker(i + 3 * j));
            }

            if (column.every(square => square == 'X')) 
            {
                return 'X';
            }

            else if (column.every(square => square == 'O'))
            {
                return 'O';
            }
        }

        return 'nowin';
    }

    /**
     * Checks if either diagonal has three of the same mark.
     *
     * @return {String} Returns the winning player's mark or "nowin" if
     * no win is found.
     */
    function checkDiagonal()
    {
        diagonal1 = [gameBoard.getMarker(0), gameBoard.getMarker(4), gameBoard.getMarker(8)];
        diagonal2 = [gameBoard.getMarker(6), gameBoard.getMarker(4), gameBoard.getMarker(2)];
       
        //Checks if either diagonal is filled with X
        if (diagonal1.every(square => square == 'X') || diagonal2.every(square => square == 'X')) 
        {
            return 'X';
        }

        //Checks if either diagonal is filled with O
        else if (diagonal1.every(square => square == 'O') || diagonal2.every(square => square == 'O')) 
        {
            return 'O';
        }

        else 
        { 
            return 'nowin'; 
        }
    }

    return {updatePlayer, checkPosition, checkForWin, resetLogic, typeOfAI, easyAI, mediumAI, hardAI, impossibleAI};
}) ();

const displayController = (() => {

    //Identifies the message display so it can be updated.
    let display = document.querySelector('.messageDisplay');

    //Identifies all squares in the gameboard.
    let boardSquares = Array.from(document.querySelectorAll('.square'));

    //Adds on click event listeners to each square that are attatched to
    //the setMarker function, giving basic game functionality.
    boardSquares.forEach(square => {
        square.addEventListener('click', setMarker);
    });

    /**
     * Clears the onscreen board of content.
     *
     * @return {void}
     */
    function clearBoard()
    {
        for (let i = 0; i < 9; ++i)
        {
            boardSquares[i].textContent = gameBoard.getMarker(i);
        }

        updateDisplay("O", "nowin");
    }

    /**
     * Updates the display if a move is made or the game ends.
     *
     * @param {string} marker The marker of the last player
     * @param {string} winner The winner of the game, if applicable
     * @return {void}
     */
    function updateDisplay(marker, winner)
    {
        if (winner == "X")
        {
            display.textContent = "Player X wins!";
        }

        else if (winner == "O")
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
                display.textContent = "Player O's turn."
            }

            else
            {
                display.textContent = "Player X's turn.";
            }
        }
    }

    /**
     * Removes user's ability to click temporarily so they cannot double
     * place. Then, pauses for a half-second and places AI marker. 
     * Afterwards, reinstates user's ability to play.
     *
     * @param {string} marker The marker of the AI
     * @param {number} position The position where the AI played
     * @param {string} result 'O' if the AI's move resulted in a win.
     * @return {void}
     */
    function placeAIMarker(marker, position, result)
    {
        boardSquares.forEach(square => {
            square.removeEventListener('click', setMarker);
        });

        delay(1000).then(() => {
            boardSquares[position].textContent = marker;
            boardSquares[position].style.color = "white";
            updateDisplay('O', result);

            boardSquares.forEach(square => {
                square.addEventListener('click', setMarker);
            });
        });
    }

    /**
     * Pauses the next block of code for a specified amount of time.
     *
     * @param {number} time Amount of time in milliseconds that the code will be paused.
     * @return {Promise} Promises that the next block of code will be executed
     * after the specified amount of time.
     */
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    /**
     * First checks if the game is over, and if so, clears the board on click.
     * If the spot in the onscreen board is available, places the current
     * player's marker in that spot, then places it within the gameBoard
     * array.
     *
     * @param {Event} e The clicked div inside of the onscreen gameBoard.
     * @return {void}
     */
    function setMarker(e)
    {
        let result = gameFlow.checkForWin();

        if (result == "X" || result == "O" || result == "TIE")
        {
            reset();
            return;
        }

        let marker = gameFlow.checkPosition(e.target.id);

        if (marker == "X" || marker == "O")
        {
            boardSquares[e.target.id].textContent = marker;
            boardSquares[e.target.id].style.color = "white";

            let result = gameFlow.checkForWin(e.target.id, marker);

            updateDisplay(marker, result);

            if (gameFlow.typeOfAI() == "Easy" && result != "X" && result != "TIE")
            {
                gameFlow.easyAI();
            }

            else if (gameFlow.typeOfAI() == "Medium" && result != "X" && result != "TIE")
            {
                gameFlow.mediumAI();
            }

            else if (gameFlow.typeOfAI() == "Hard" && result != "X" && result != "TIE")
            {
                gameFlow.hardAI();
            }

            else if (gameFlow.typeOfAI() == "Impossible" && result != "X" && result != "TIE")
            {
                gameFlow.impossibleAI();
            }

            else
            {
                gameFlow.updatePlayer();
            }
        }

        else
        {
            return;
        }
    }

    //Gives the reset button functionality.
    const resetButton = document.querySelector('.reset');
    resetButton.addEventListener('click', reset);

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

    //Button to play against the Easy AI.
    const easyAI = document.querySelector('.easy');
    easyAI.addEventListener('click', function() 
    {
        //Calls clearBoard in the gameBoard object, then calls the local
        //displayController clearBoard to match. Afterwards, resets the 
        //games logic to use the Easy AI.
        gameBoard.clearBoard();
        clearBoard();
        gameFlow.resetLogic("Easy");
    })

    //Button to play against the Medium AI.
    const medAI = document.querySelector('.medium');
    medAI.addEventListener('click', function() 
    {
        //Calls clearBoard in the gameBoard object, then calls the local
        //displayController clearBoard to match. Afterwards, resets the 
        //games logic to use the Medium AI.
        gameBoard.clearBoard();
        clearBoard();
        gameFlow.resetLogic("Medium");
    })

    //Button to play against the Hard AI.
    const hardAI = document.querySelector('.hard');
    hardAI.addEventListener('click', function() 
    {
        //Calls clearBoard in the gameBoard object, then calls the local
        //displayController clearBoard to match. Afterwards, resets the 
        //games logic to use the Hard AI.
        gameBoard.clearBoard();
        clearBoard();
        gameFlow.resetLogic("Hard");
    })

    //Button to play against the Impossible AI.
    const impsAI = document.querySelector('.impossible');
    impsAI.addEventListener('click', function() 
    {
        //Calls clearBoard in the gameBoard object, then calls the local
        //displayController clearBoard to match. Afterwards, resets the 
        //games logic to use the Easy AI.
        gameBoard.clearBoard();
        clearBoard();
        gameFlow.resetLogic("Impossible");
    })

    /**
     * Resets the onscreen board, the gameBoard array, and remembers the
     * game's AI logic (if existed).
     *
     * @return {void}
     */
    function reset()
    {
        boardSquares.forEach(square => {
            square.style.color = "transparent";
        });        

        let logic = gameFlow.typeOfAI();

        gameBoard.clearBoard();
        clearBoard();
        gameFlow.resetLogic(logic);
    }

    return {placeAIMarker};
}) ();