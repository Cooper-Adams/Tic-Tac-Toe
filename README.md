# Tic-Tac-Toe

Tic Tac Toe is a game where the board is 3x3 and the user is aiming to place three of their symbol in a row horizontally, vertically, or diagonally.

Play it here: https://cooper-adams.github.io/Tic-Tac-Toe/

The goal in this project is create a playable Tic-Tac-Toe game within a browser and the logic of the game is entirely within modules or factories.

There are three modules that house the logic:

gameBoard - Keeps the array private and gives 4 public functions to access/modify it.

gameFlow - Deals with all gameplay logic. Has nine public functions, and 7 private functions. The private functions deal with checking for wins in the rows, columns, and diagonals. In addition, a few of the private functions contain the logic for the AI, specifically the MiniMax algorithm and its helpers. The MiniMax algorithm analyses the current game state and all possible future states to find the best move possible for that game state. And to increase efficiency, I am using Alpha-Beta pruning to prevent analysing further worst case board states.

displayController - Deals with the display in its entirety. All members are private, and there is one public function to be used for the AI to place their marker when they select their position. Also contains a delay function to make it seem as though the computer is thinking before making their move.


The MiniMax algorithm is efficient and effective thanks to the alpha-beta pruning, and at best you can tie with the AI on the "Impossible" difficulty. Otherwise, the game can end in a tie or have either player win in PvP or the other AI difficulties.

Future Considerations:

- Score Board (Displays both user's marker's or one user's and the AI's)
- Custom select dropdown (The options of the HTML select element cannot be styled with CSS)
- Functionality to play as X or O.
