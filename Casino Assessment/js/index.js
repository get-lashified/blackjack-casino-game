let suits = ["Diamonds", "Hearts", "Spades", "Clubs"];
let values = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
let deck = [];
let numberOfCardsInDeck = deck.length;
let players = [];
let currentPlayer = 0;

//====================================================
// Section 1: Build Deck
//====================================================

// Creates a new deck with 52 cards and assigns a real value to cards with no denomination.
function createDeck() {
    deck = [];
    for (let i = 0; i < values.length; i++) {
        for (let x = 0; x < suits.length; x++) {

            // Parses a string and returns an integer.
            let denomination = parseInt(values[i]);

            if (values[i] === "Jack" || values[i] === "Queen" || values[i] === "King")
                denomination = 10;

            if (values[i] === "Ace")
                denomination = 1;

            deck.push({Value: values[i], Suit: suits[x], Denomination: denomination});
        }
    }
}

// Shuffles the deck by randomly swapping them.
function shuffle() {
    let counter = deck.length, temp, i;

    while (counter) {
        i = Math.floor(Math.random() * counter--);
        temp = deck[counter];
        deck[counter] = deck[i];
        deck[i] = temp;
    }

    return deck;
}

// Each new card drawn from the deck will be unique as it
// removes the drawn card from the deck.
function removeDealtCards(removeCard) {
    for (let i = removeCard; i <= numberOfCardsInDeck - 2; i++) {
        deck[i] = deck[i + 1];
    }
    numberOfCardsInDeck--;
}

// Displays a suitable message if the players points is greater than 21.
function bust() {
    if (players[currentPlayer].Points > 21) {
        displayStatus('Player ' + players[currentPlayer].ID + ': Bust!');
        endGame();
    }
}

// Updates the count of cards remaining in the deck.
function updateDeck() {
    document.getElementById('cardsInDeck').innerHTML = deck.length;
}

//====================================================
// Section 2: Create Player Options
//====================================================

// Allow the player to take another card.
function hit() {
    let card = deck.pop();
    players[currentPlayer].Hand.push(card);

    createCard(card, currentPlayer);
    updatePoints();
    updateDeck();
    bust();
}

// Allow the play to stop taking cards.
function stand() {
    if (currentPlayer !== players.length - 1) {
        document.getElementById('player_' + currentPlayer).classList.remove('active');
        currentPlayer += 1;
        document.getElementById('player_' + currentPlayer).classList.add('active');
    } else {
        endGame();
    }
}

//====================================================
// Section 3: Create Players
//====================================================

// Dynamically create players as needed.
function createPlayers(numberOfPlayers) {
    players = [];

    for (let i = 1; i <= numberOfPlayers; i++) {
        let hand = [];
        players.push({Name: 'Player ' + i, ID: i, Points: 0, Hand: hand});
    }
}

// Deals 2 cards for each player.
function dealCards() {
    for (let i = 0; i < 2; i++) {
        for (let x = 0; x < players.length; x++) {
            let card = deck.pop();
            players[x].Hand.push(card);

            createCard(card, x);
            updatePoints();
            removeDealtCards(i);
        }
    }

    updateDeck();
}

//====================================================
// Section 4: Render UI
//====================================================

// Displays the card setup.
function createUI() {
    document.getElementById('players').innerHTML = '';
    for (let i = 0; i < players.length; i++) {
        let div_player = document.createElement('div');
        let div_player_id = document.createElement('div');
        let div_hand = document.createElement('div');
        let div_points = document.createElement('div');

        div_points.className = 'points';
        div_player.className = 'player';
        div_points.id = 'points_' + i;
        div_player.id = 'player_' + i;
        div_hand.id = 'hand_' + i;

        if (players[i].ID === 1) {
            div_player_id.innerHTML = 'Player ' + players[i].ID;
        } else {
            div_player_id.innerHTML = 'Dealer';
        }

        div_player.appendChild(div_player_id);
        div_player.appendChild(div_hand);
        div_player.appendChild(div_points);
        document.getElementById('players').appendChild(div_player);
    }
}

// Adding a card to the players hand once dealt.
function createCard(card, player) {
    let hand = document.getElementById('hand_' + player);
    hand.appendChild(createIcons(card));
}

// Creates the icon for each unique card.
function createIcons(card) {
    let icon = '';
    let el = document.createElement('div');

    switch (card.Suit) {
        case 'Hearts':
            icon = '&hearts;';
            break;
        case 'Spades':
            icon = '&spades;';
            break;
        case 'Diamonds':
            icon = '&diams;';
            break;
        case 'Clubs':
            icon = '&clubs;';
            break;
    }

    el.className = 'card';
    el.innerHTML = card.Value + ' ' + icon;

    return el;
}

// Highlights the current active player.
function activePlayer() {
    document.getElementById('player_' + currentPlayer).classList.add('active');
}

// Displays a suitable status message.
function displayStatus(message) {
    document.getElementById('status').innerHTML = message;
    document.getElementById('status').style.display = "inline-block";
}

//====================================================
// Section 5: Player Points
//====================================================

// Returns the players points.
function getPoints(player) {
    let points = 0;

    for (let i = 0; i < players[player].Hand.length; i++) {
        points += players[player].Hand[i].Denomination;
    }

    players[player].Points = points;

    return points;
}

// Updates the players points.
function updatePoints() {
    for (let i = 0; i < players.length; i++) {
        getPoints(i);
        document.getElementById('points_' + i).innerHTML = "Total: " + players[i].Points;
    }
}

//===============================================================================
// Section 6:
// Logic: Checks which player is the winner based on the conditions.
//===============================================================================
function endGame() {
    let winner = -1;
    let score = 0;

    for (let i = 0; i < players.length; i++) {
        if (players[i].Points > score && players[i].Points < 22) {
            winner = i;
        }

        score = players[i].Points;
    }

    if (players[winner].ID === 1) {
        displayStatus('Player 1 Wins!');
    } else {
        displayStatus('Dealer Wins!');
    }
}

//====================================================
// Section 7: Start The Game
//====================================================

// Call all functions that are require to start the game
function startGame() {
    currentPlayer = 0;
    document.getElementById('status').style.display = 'none';

    createDeck();
    shuffle();
    createPlayers(2);
    createUI();
    dealCards();
    activePlayer();
}