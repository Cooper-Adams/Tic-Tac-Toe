# Tic-Tac-Toe

Tic Tac Toe is a game where the board is 3x3 and the user is aiming to place three of their symbol in a row horizontally, vertically, or diagonally.

The goal in this project is create a playable Tic-Tac-Toe game within a browser and the logic of the game is entirely within modules or factories.

There are three modules that house the logic:

gameBoard - Keeps the array private and gives three public functions to access/modify it.

gameFlow - Deals with all gameplay logic. Has two public functions, checkPosition and checkForWin. Also houses three private functions that check the different win conditions: 3 in a row horizontally, vertically, or diagonally.

displayController - Deals with the display in its entirety. All functions and members are private, and the only way the user can directly invoke one (placeMarker) is by playing the game and choosing a spot to place a marker. 