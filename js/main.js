"use strict"

var gBoard
const MINE = '💣'
const FLAG = '🚩'
const LIVES = '💖'

var gClicks
var gCountLives
var gMarkedMines


const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


///////////////////////////////////////

function onInit() {

    gClicks = 0
    gMarkedMines = 0 
    gCountLives = 2
    gGame.markedCount = gLevel.MINES

    gBoard = buildBoard()
    if (gClicks === 0) {
        addRandMines()
        setMinesNegsCount(gBoard);
    }
    rendLeftLives()
    rendLeftFlags()   
    renderBoard(gBoard)
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
    // board[1][1].isMine = true
    // board[3][3].isMine = true  hard coded for QA

    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`
            var cellContent = ''

            if (cell.isShown && cell.isMine) {
                cellContent = cell.isMine ? MINE : cell.minesAroundCount;
            }
            strHTML += `<td class="${className} " onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j}); return false;">${cellContent}</td>`
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
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) {
                count++
            }
        }
    }
    return count
}


function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]

    if (cell.isMine === true && cell.isShown === false) {

        gCountLives--
        displayMine(elCell)
        rendLeftLives()
        cell.isShown = true
        elCell.classList.add('clicked')

        // gGame.shownCount++
        checkGameOver()

    }
    if(cell.isMine === false) {
        cell.isShown = true
        elCell.classList.add('clicked')
        gGame.shownCount++

        if (cell.minesAroundCount > 0) {
            // cell.minesAroundCount = checkNeighbors(gBoard, i, j)
            elCell.innerHTML = cell.minesAroundCount

        } else {
            expandShown(gBoard, i, j)
        }
        gClicks++
        checkGameOver()
    }

}

function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (i === rowIdx && j === colIdx) continue

            var currCell = board[i][j]
            var cellSelector = '.' + getClassName({ i: i, j: j })
            var elNeighborCell = document.querySelector(cellSelector)

            if (currCell.isMine === false && currCell.isShown === false) {
                currCell.isShown = true
                elNeighborCell.classList.add('clicked')
                gGame.shownCount++
                if (currCell.minesAroundCount > 0) {
                    elNeighborCell.innerHTML = currCell.minesAroundCount
                }else {
                    expandShown(board, i, j)
                }
            }
        }
    }
}


function displayMine(cell) {

    cell.innerHTML = MINE
    cell.classList.remove('mine')

}

function displayMines() {
    const cells = document.querySelectorAll(".cell");

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = gBoard[i][j];

            if (cell.isMine) {
                const cellIdx = i * gLevel.SIZE + j
                cells[cellIdx].innerHTML = MINE
                cells[cellIdx].classList.remove('mine')
            }
        }
    }
}



// function displayMines() {
//     const cells = document.querySelectorAll(".cell")

//     for (var i = 0; i < gLevel.SIZE ** 2; i++) {
//         if (cells[i].innerHTML === MINE) {
//             cells[i].classList.remove('mine')
//         }
//     }
// }


function addRandMines() {

    var numOfMines = gLevel.MINES

    for (var i = 0; i < numOfMines; i++) {
        const randRowIdx = getRandomInt(0, gLevel.SIZE)
        const randColIdx = getRandomInt(0, gLevel.SIZE)
        var designatedCell = gBoard[randRowIdx][randColIdx]

        if (designatedCell.isMine === true) {
            numOfMines++
            continue
        }
        else designatedCell.isMine = true
    }
}

function onCellMarked(elCell, i, j) {
    event.preventDefault()
    const cell = gBoard[i][j]
    if (cell.isShown) return

    if (cell.isMarked) {
        cell.isMarked = false;
        elCell.innerHTML = '';
        if (gGame.markedCount < 2) {
            gGame.markedCount++
            if (cell.isMine) gMarkedMines--
        }
    } else {
        if (gGame.markedCount > 0) {
            cell.isMarked = true;
            elCell.innerHTML = FLAG;
            gGame.markedCount--
            if (cell.isMine) gMarkedMines++
        }
    }

    rendLeftFlags()
    checkGameOver()
}




function rendLeftFlags() {
    const elFlagCount = document.querySelector('.flag');
    elFlagCount.textContent = gGame.markedCount;
}

function rendLeftLives() {
    const elFlagCount = document.querySelector('.live');
    elFlagCount.textContent = gCountLives;
}


function checkGameOver() {
    if ((gLevel.SIZE ** 2) === (gMarkedMines + gGame.shownCount)) {
        gGame.isOn = false
        gameOver('VICTORIOUS! You are a mine expret!')

    }
    if (gCountLives === 0) {
        gGame.isOn = false
        displayMines()
        gameOver('YOU LOST! Be Careful next time you are at the golan heights')
    }
}


function gameOver(txt) {

    const elTitle = document.querySelector('.title')
    elTitle.innerText = txt

    const elModal = document.querySelector('.modal')
    elModal.classList.remove('hide')

    console.log('Game Over')



}

function playAgain() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hide')
    onInit()
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


