"use strict"

var gBoard
const MINE = '💣'
const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

///////////////////////////////////////


function onInit() {

    gBoard = buildBoard()
    renderBoard(gBoard)

    console.log(gBoard)
    console.table(gBoard)
}




function buildBoard() {
    const board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }

    board[1][1].isMine = true
    board[3][3].isMine = true

    setMinesNegsCount(board)

    return board
}


function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = `cell `
            const cellContent = cell.isMine ? '' : ''
            strHTML += `<td class="${className} " onclick="onCellClicked(this, ${i}, ${j})">${cellContent}</td>`

            // if (cell.isMine === false || cell.minesAroundCount > 0) {
            //     strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})">${cell.minesAroundCount} </td>`
            // }
            // if (cell.isMine === true) {
            //     strHTML += `<td class="${className} " onclick="onCellClicked(this, ${i}, ${j})">${MINE}</td>`
            // }
            // if () {
            //     strHTML += `<td class="${className}"></td>`
            // }



        }
        strHTML += '</tr>'
    }

    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function setMinesNegsCount(board) {

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            const currCell = board[i][j]
            currCell.minesAroundCount = checkNeighbors(board, i, j)
        }
    }
}


function checkNeighbors(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue;
            if (j < 0 || j >= board[0].length) continue;
            var currCell = board[i][j];
            if (currCell.isMine) {
                count++;
            }
        }
    }
    return count;
}


function onCellClicked(elCell, i, j) {

    const cell = gBoard[i][j]

    if(cell.isMine === false ){
        checkNeighbors(board, rowIdx, colIdx)
    }


    if(cell.isMine === true ){
        displyMine(elCell)
    }

}



function displyMine(cell) {

    cell.innerHTML = MINE;
    cell.classList.remove('mine');


}





function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}



function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location)
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}