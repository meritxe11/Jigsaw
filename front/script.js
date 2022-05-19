class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      board: null,
      word: null,
      gameOver: false,
      moves: 0,
      message: null,
      username: null
    };

  }

  /**
   * Connecting to the server and parsing json
   * @returns Paraula
   */
  getWord() {
    let paraula = []
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://127.0.0.1/sad/new_word.php", false);

    xmlhttp.addEventListener('load', function (datos) {
      const jsonDatos = JSON.parse(datos.target.response)
      let aux = JSON.stringify(jsonDatos).toUpperCase()
      paraula = [aux.charAt(11), aux.charAt(12), aux.charAt(13), aux.charAt(14)]
    }); xmlhttp.send();
    return paraula
  }

  /**
   * Initializes counter. It puts the word in random positions. In the case it is placed randomly
   *  in the first row in the final order, it removes them and create the table again. The rest of
   *  the cells (blank cells) are filled with random letters, not those containing the word. It
   *  leaves cell[3,3] blank.
   */
  initBoard() {
    this.state.word = this.getWord();     //starts the game with a new random word
    let board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

    for (let i = 0; i < this.state.word.length; i++) {
      board = this.placeRandom(board, this.state.word[i]);
      if (i === this.state.word - 1 && this.checkForGameOver) {
        for (j = 0; j < 4; j++) { board[0][j] = 0; }
        i = 0;
      }
    }
    const blankCoordinates = this.getBlankCoordinates(board);
    let random_letter = '';
    var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for (let a = 0; a < blankCoordinates.length; a++) {
      random_letter = arr[Math.floor(Math.random() * 26)];
      if (!this.state.word.includes(random_letter)) {
        board = this.placeRandom(board, random_letter);
      } else {
        a--;
      }
    }
    this.setState({ board, gameOver: false, moves: 0, message: null });
  }

  /**
   * Scroll through the counter and look for blank cells and return the positions that are empty
   * @param {*} board 
   * @returns 
   */
  getBlankCoordinates(board) {
    const blankCoordinates = [];
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (!(r === 3 && c === 3)) {
          if (board[r][c] === 0) { blankCoordinates.push([r, c]); }
        }
      }
    }
    return blankCoordinates;
  }

  /**
   * Find the empty spaces and choose one random where it puts the letter passed by parameter
   * @param {*} board 
   * @param {*} letter 
   * @returns 
   */
  placeRandom(board, letter) {
    const blankCoordinates = this.getBlankCoordinates(board);
    const randomCoordinate = blankCoordinates[Math.floor(Math.random() * blankCoordinates.length)];
    board[randomCoordinate[0]][randomCoordinate[1]] = letter;
    return board;
  }

  /**
   * Depending on the direction move and update the state of the game and checks for game over.
   * @param {*} direction 
   */
  move(direction) {
    if (!this.state.gameOver) {
      if (direction === 'up') {
        const movedUp = this.moveUp(this.state.board);
        if (this.checkForGameOver(movedUp.board)) {
          this.setState({ board: movedUp.board, gameOver: true, message: 'WINNER!' });
        } else {
          this.setState({ board: movedUp.board });
        }

      } else if (direction === 'right') {
        const movedRight = this.moveRight(this.state.board);
        if (this.checkForGameOver(movedRight.board)) {
          this.setState({ board: movedRight.board, gameOver: true, message: 'WINNER!' });
        } else {
          this.setState({ board: movedRight.board });
        }

      } else if (direction === 'down') {
        const movedDown = this.moveDown(this.state.board);
        if (this.checkForGameOver(movedDown.board)) {
          this.setState({ board: movedDown.board, gameOver: true, message: 'WINNER!' });
        } else {
          this.setState({ board: movedDown.board });
        }

      } else if (direction === 'left') {
        const movedLeft = this.moveLeft(this.state.board);
        if (this.checkForGameOver(movedLeft.board)) {
          this.setState({ board: movedLeft.board, gameOver: true, message: 'WINNER!' });
        } else {
          this.setState({ board: movedLeft.board });
        }
      }
    } else {
      this.setState({ username: document.getElementById('username').value });
      if (this.state.username === '') {
        alert("Please write your name and press enter");
      } else { this.endGame(); }
    }
  }

  /**
   * Iter the table from left to right, and for each column from top to bottom. See 
   * what the empty position '0' is, and if it can move to the right.
   * @param {*} inputBoard 
   * @returns 
   */
  moveRight(inputBoard) {
    let board = inputBoard;
  
    for (let r = 0; r < inputBoard.length; r++) {
      for (let c = 0; c < inputBoard[r].length; c++) {
        let current = inputBoard[r][c];
        if (current === 0 && (c - 1) >= 0) {
          board[r][c] = board[r][c - 1];
          board[r][c - 1] = 0;
          this.state.moves++;
        }
      }
    }
    return { board };
  }

  moveLeft(inputBoard) {
    let board = inputBoard;
  
    for (let r = 0; r < inputBoard.length; r++) {
      for (let c = inputBoard[r].length - 1; c >= 0; c--) {
        let current = inputBoard[r][c];
        if ((current === 0) && ((c + 1) < inputBoard[r].length)) {
          board[r][c] = board[r][c + 1];
          board[r][c + 1] = 0;
          this.state.moves++;
        }
      }
    }
    return { board };
  }

  rotateRight(matrix) {
    let result = [];
    for (let c = 0; c < matrix.length; c++) {
      let row = [];
      for (let r = matrix.length - 1; r >= 0; r--) {
        row.push(matrix[r][c]);
      }
      result.push(row);
    }
    return result;
  }

  rotateLeft(matrix) {
    let result = [];
    for (let c = matrix.length - 1; c >= 0; c--) {
      let row = [];
      for (let r = matrix.length - 1; r >= 0; r--) {
        row.unshift(matrix[r][c]);
      }
      result.push(row);
    }
    return result;
  }

  moveUp(inputBoard) {
    let rotatedRight = this.rotateRight(inputBoard);
    let board = rotatedRight;
    // move right
    for (let r = 0; r < rotatedRight.length; r++) {
      for (let c = 0; c < rotatedRight[r].length; c++) {
        let current = rotatedRight[r][c];
        if (current === 0 && (c - 1) >= 0) {
          board[r][c] = board[r][c - 1];
          board[r][c - 1] = 0;
          this.state.moves++;
        }
      }
    }
    // Rotate board back upright
    board = this.rotateLeft(board);
    return { board };
  }

  moveDown(inputBoard) {
    let rotatedRight = this.rotateRight(inputBoard);
    let board = rotatedRight;
    // move left
    for (let r = 0; r < rotatedRight.length; r++) {
      for (let c = rotatedRight[r].length - 1; c >= 0; c--) {
        let current = rotatedRight[r][c];
        if (current === 0 && (c + 1) < rotatedRight[r].length) {
          board[r][c] = board[r][c + 1];
          board[r][c + 1] = 0;
          this.state.moves++;
        }
      }
    }
    // Rotate board back upright
    board = this.rotateLeft(board);
    return { board };
  }

  /**
   * Check if the word is correctly placed in the first row
   * @param {*} board 
   * @returns 
   */
  checkForGameOver(board) {
    let i = 0;
    for (let c = 0; c < board.length; c++) {
      if (board[0][c] === this.state.word[c]) { i++; }
    }
    if (i === 4) { return true; }
    return false;
  }

  /**
   * Executed in move when the game is checked of being over. The communication 
   * with the BD and route to ranking takes place in this method.
   */
  endGame() {
    document.getElementById('username').disabled = true;
    alert("Congratulations, you have won! Let's see the ranking");
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://127.0.0.1/sad/ranking.php?usuari=" + this.state.username + "&punts=" + this.state.moves, false);

    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
      }
      window.location.href = "http://127.0.0.1/sad/ranking2.php";
    }
    xmlhttp.send();
  }

  /**
   * Ran before the component is rendered
   */
  componentWillMount() {
    this.initBoard();
    const body = document.querySelector('body');
    body.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
   * Reads keyboards keys you are typing
   * @param {*} e 
   */
  handleKeyDown(e) {
    const up = 38;
    const right = 39;
    const down = 40;
    const left = 37;
    const enter = 13;

    if (e.keyCode === up) {
      this.move('up');
    } else if (e.keyCode === right) {
      this.move('right');
    } else if (e.keyCode === down) {
      this.move('down');
    } else if (e.keyCode === left) {
      this.move('left');
    } else if (e.keyCode === enter) {
      this.move('');
    }
  }

  /**
   * React renders HTML to the web page by using a function called render().
   * The purpose of the function is to display the specified HTML code inside the specified HTML element.
   * In the render() method, we can read props and state and return our JSX code to the root component of our app.
   * @returns 
   */
  render() {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
        React.createElement("div", { className: "button", onClick: () => { this.initBoard(); } }, "New Game"), /*#__PURE__*/

        React.createElement("div", { className: "buttons" }, /*#__PURE__*/
          React.createElement("div", { className: "button", onClick: () => { this.move('up'); } }, "Up"), /*#__PURE__*/
          React.createElement("div", { className: "button", onClick: () => { this.move('right'); } }, "Right"), /*#__PURE__*/
          React.createElement("div", { className: "button", onClick: () => { this.move('down'); } }, "Down"), /*#__PURE__*/
          React.createElement("div", { className: "button", onClick: () => { this.move('left'); } }, "Left")), /*#__PURE__*/

        React.createElement("div", { className: "buttons" },
          React.createElement("div", { className: "word" }, "Word: ", this.state.word), /*#__PURE__*/
          React.createElement("div", { className: "moves" }, "Number of moves: ", this.state.moves)),

        React.createElement("table", null,
          this.state.board.map((row, i) => /*#__PURE__*/React.createElement(Row, { key: i, row: row }))), /*#__PURE__*/
        React.createElement("p", null, this.state.message)));
  }
}
;

/**
 * Map row and place all cells
 * @param {*} param0 
 * @returns 
 */
const Row = ({ row }) => {
  return /*#__PURE__*/(
    React.createElement("tr", null,
      row.map((cell, i) => /*#__PURE__*/React.createElement(Cell, { key: i, cellValue: cell }))));
};

/**
 * Creates and defines the cell object
 * @param {*} param0 
 * @returns 
 */
const Cell = ({ cellValue }) => {
  let value = cellValue === 0 ? '' : cellValue;
  let color = 'cell';


  return /*#__PURE__*/(
    React.createElement("td", null, /*#__PURE__*/
      React.createElement("div", { className: color }, /*#__PURE__*/
        React.createElement("div", { className: "letter" }, value))));
};


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('main'));