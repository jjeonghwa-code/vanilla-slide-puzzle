import Piece from './Piece';

class Puzzle {
  constructor (size = 4, image = 'img/default.jpg') {
    this.element = document.getElementById('board');
    this.size = size;
    this.image = image;
    this.pieces = [];
    this.cue = null;
    this.start = false;
    this.moveCount = 0;
    this.shufflePieces = this.shufflePieces.bind(this);
    this.checkWin = this.checkWin.bind(this);
    this.createBoard();
  }

  createBoard() {
    this.clearBoard();
    this.createPieces();
    this.appendPieces();
    setTimeout(() => {
      this.shufflePieces();
    }, 600);
  }

  clearBoard() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }

  createPieces() {
    const numOfPieces = Math.pow(this.size, 2);
    for (let i = 0; i < numOfPieces; i++) {
      const piece = new Piece(this);
      // Last piece to be made is the cue
      if (i + 1 === numOfPieces) {
        piece.element.className = 'piece cue';
        this.cue = piece;
      }
      this.pieces.push(piece);
    }
  }

  appendPieces() {
    this.pieces.forEach(piece => {
      this.element.appendChild(piece.element);
    });
  }

  shufflePieces(e) {
    if (e) e.preventDefault();
    this.start = false; // Suspend winning during shuffle

    let count = 0;
    let neighbors;
    let random;

    // Moves must be legal even while shuffling
    // otherwise the puzzle will be unsolvable
    while (count < 100) {
      neighbors = this.pieces.filter(piece => {
        return piece.neighborsCue();
      });
      random = Math.floor(Math.random() * (neighbors.length));
      neighbors[random].clickHandler();
      count++;
    }

    this.restartPuzzle();
  }

  isSolved() {
    if (this.start === false) return false;

    const incorrect = this.pieces.filter(piece => {
      const id = piece.element.id.split('-');
      if (id[0] !== `${piece.x}` || id[1] !== `${piece.y}`) return true;
    });
    if (!incorrect.length) return true;
    else return false;
  }

  checkWin() {
    if (this.isSolved()) {
      document.getElementById('header').innerHTML = `Solved in ${this.moveCount} moves!`;
      this.cue.element.style.filter = 'opacity(100%)';
      this.pieces.forEach(piece => {
        piece.element.style.outline = '0px';
      });
    }
  }

  restartPuzzle() {
    this.start = true;
    this.moveCount = 0;
    document.getElementById('header').innerHTML = `Slide Puzzle`;
    this.cue.element.style.filter = 'opacity(0%)';
    this.pieces.forEach(piece => {
      piece.element.style.outlineWidth = '2px';
    });
  }
}

export default Puzzle;
