var board,
    game = new Chess();

/*The "AI" part starts here */

var minimaxRoot = function (depth, game, isMaximisingPlayer) {

    var newGameMoves = game.ugly_moves();
    var bestMove = -9999;
    var bestMoveFound;

    for (var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i]
        game.ugly_move(newGameMove);
        var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
        game.undo();
        if (value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    return bestMoveFound;
};

var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        return -evaluateBoard(game.board());
    }

    var newGameMoves = game.ugly_moves();

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
};

var evaluateBoard = function (board) {
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j);
        }
    }
    return totalEvaluation;
};



var getPieceValue = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }
    if (piece.color === 'b') {
        x = 7 - x;
    }
    var getAbsoluteValue = function (piece) {
        var posVal = 0.1;
        if (piece.type === 'p') {
            posVal = pawnArrayS[x][y]
            return (10 * (posVal + 2));
        } else if (piece.type === 'r') {
            posVal = rookArrayS[x][y]
            return (50 * (posVal + 2));
        } else if (piece.type === 'n') {
            posVal = knightArrayS[x][y]
            return (30 * (posVal + 2));
        } else if (piece.type === 'b') {
            posVal = bishopArrayS[x][y]
            return (30 * (posVal + 2));
        } else if (piece.type === 'q') {
            posVal = queenArrayS[x][y]
            return (90 * (posVal + 2));
        } else if (piece.type === 'k') {
            posVal = kingArrayS[x][y]
            return (900 * (posVal + 2));
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};

pawnArray = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

pawnArrayS = [
    [0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857],
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    [0.42857142857142855, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.7142857142857143, 0.5714285714285714, 0.42857142857142855, 0.42857142857142855],
    [0.35714285714285715, 0.35714285714285715, 0.42857142857142855, 0.6428571428571429, 0.6428571428571429, 0.42857142857142855, 0.35714285714285715, 0.35714285714285715],
    [0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.5714285714285714, 0.5714285714285714, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857],
    [0.35714285714285715, 0.21428571428571427, 0.14285714285714285, 0.2857142857142857, 0.2857142857142857, 0.14285714285714285, 0.21428571428571427, 0.35714285714285715],
    [0.35714285714285715, 0.42857142857142855, 0.42857142857142855, 0.0, 0.0, 0.42857142857142855, 0.42857142857142855, 0.35714285714285715],
    [0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857]
]

knightArray = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
]

knightArrayS = [
    [0.0, 0.14285714285714285, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.14285714285714285, 0.0],
    [0.14285714285714285, 0.42857142857142855, 0.7142857142857143, 0.7142857142857143, 0.7142857142857143, 0.7142857142857143, 0.42857142857142855, 0.14285714285714285],
    [0.2857142857142857, 0.7142857142857143, 0.8571428571428571, 0.9285714285714286, 0.9285714285714286, 0.8571428571428571, 0.7142857142857143, 0.2857142857142857],
    [0.2857142857142857, 0.7857142857142857, 0.9285714285714286, 1.0, 1.0, 0.9285714285714286, 0.7857142857142857, 0.2857142857142857],
    [0.2857142857142857, 0.7142857142857143, 0.9285714285714286, 1.0, 1.0, 0.9285714285714286, 0.7142857142857143, 0.2857142857142857],
    [0.2857142857142857, 0.7857142857142857, 0.8571428571428571, 0.9285714285714286, 0.9285714285714286, 0.8571428571428571, 0.7857142857142857, 0.2857142857142857],
    [0.14285714285714285, 0.42857142857142855, 0.7142857142857143, 0.7857142857142857, 0.7857142857142857, 0.7142857142857143, 0.42857142857142855, 0.14285714285714285],
    [0.0, 0.14285714285714285, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.2857142857142857, 0.14285714285714285, 0.0]
]

bishopArray = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
]

bishopArrayS = [
    [0.0, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.0],
    [0.3333333333333333, 0.6666666666666666, 0.6666666666666666, 0.6666666666666666, 0.6666666666666666, 0.6666666666666666, 0.6666666666666666, 0.3333333333333333],
    [0.3333333333333333, 0.6666666666666666, 0.8333333333333334, 1.0, 1.0, 0.8333333333333334, 0.6666666666666666, 0.3333333333333333],
    [0.3333333333333333, 0.8333333333333334, 0.8333333333333334, 1.0, 1.0, 0.8333333333333334, 0.8333333333333334, 0.3333333333333333],
    [0.3333333333333333, 0.6666666666666666, 1.0, 1.0, 1.0, 1.0, 0.6666666666666666, 0.3333333333333333],
    [0.3333333333333333, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.3333333333333333],
    [0.3333333333333333, 0.8333333333333334, 0.6666666666666666, 0.6666666666666666, 0.6666666666666666, 0.6666666666666666, 0.8333333333333334, 0.3333333333333333],
    [0.0, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.0]
]

rookArray = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0]
]

rookArrayS = [
    [0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333],
    [0.6666666666666666, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.6666666666666666],
    [0.0, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.0],
    [0.0, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.0],
    [0.0, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.0],
    [0.0, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.0],
    [0.0, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.0],
    [0.3333333333333333, 0.3333333333333333, 0.3333333333333333, 0.6666666666666666, 0.6666666666666666, 0.3333333333333333, 0.3333333333333333, 0.3333333333333333]
]


queenArray = [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20]
]

queenArrayS = [
    [0.0, 0.4, 0.4, 0.6, 0.6, 0.4, 0.4, 0.0],
    [0.4, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.4],
    [0.4, 0.8, 1.0, 1.0, 1.0, 1.0, 0.8, 0.4],
    [0.6, 0.8, 1.0, 1.0, 1.0, 1.0, 0.8, 0.6],
    [0.8, 0.8, 1.0, 1.0, 1.0, 1.0, 0.8, 0.6],
    [0.4, 1.0, 1.0, 1.0, 1.0, 1.0, 0.8, 0.4],
    [0.4, 0.8, 1.0, 0.8, 0.8, 0.8, 0.8, 0.4],
    [0.0, 0.4, 0.4, 0.6, 0.6, 0.4, 0.4, 0.0]
]

kingArray = [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20]
]

kingArrayS = [
    [0.25, 0.125, 0.125, 0.0, 0.0, 0.125, 0.125, 0.25],
    [0.25, 0.125, 0.125, 0.0, 0.0, 0.125, 0.125, 0.25],
    [0.25, 0.125, 0.125, 0.0, 0.0, 0.125, 0.125, 0.25],
    [0.25, 0.125, 0.125, 0.0, 0.0, 0.125, 0.125, 0.25],
    [0.375, 0.25, 0.25, 0.125, 0.125, 0.25, 0.25, 0.375],
    [0.5, 0.375, 0.375, 0.375, 0.375, 0.375, 0.375, 0.5],
    [0.875, 0.875, 0.625, 0.625, 0.625, 0.625, 0.875, 0.875],
    [0.875, 1.0, 0.75, 0.625, 0.625, 0.75, 1.0, 0.875]
]


/* board visualization and games state handling */

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};
var turn = 0;
var makeBestMove = function () {

    var bestMove = getBestMove(game);
    game.ugly_move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    if (game.game_over()) {
        alert('Game over');
    }



};


var positionCount;
var getBestMove = function (game) {
    if (game.game_over()) {
        alert('Game over');
    }

    positionCount = 0;
    var depth = parseInt($('#search-depth').find(':selected').text());

    var d = new Date().getTime();
    var bestMove = minimaxRoot(depth, game, true);
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    var positionsPerS = (positionCount * 1000 / moveTime);

    $('#position-count').text(positionCount);
    $('#time').text(moveTime / 1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    return bestMove;
};



var renderMoveHistory = function (moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + (moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);

};

var onDrop = function (source, target) {

    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    // renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function () {
    board.position(game.fen());
};

var onMouseoverSquare = function (square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function (square, piece) {
    removeGreySquares();
};

var removeGreySquares = function () {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function (square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};


board;
var initBoard = function () {
    board = ChessBoard('board', cfg);
};