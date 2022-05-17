class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      board: null,
      word: [],
      gameOver: false,
      moves: 0,
      message: null,
      username: null
    };

  }

  getWord() {
    /*let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://10.192.207.216/sad/new_word.php", true);
    xmlhttp.send();
    
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let json_word = this.xmlhttp.responseText;
        json_word = JSON.parse(json_word).word[0];
        console.log(json_word);
        this.state.word = json_word.split('');
      }
    }
    
    */
   console.log("entro en funció getWord")
    window.fetch('http://127.0.0.1/sad/new_word.php')
      .then((response) => {
        
        console.log("primra " + response.statusText)
        return response.json();  //it returns another Promise processed in the next then      
      })
      .then((res)=> {
        console.log('ha entrado en la segunda premisa' + res.statusText);
        res.map(item => (
          //console.log(res)
          this.setState({ word: item.word })
        ))        
      })

      console.log("canvio paraula a " + this.state.word);
  }

  // Create board with two random coordinate numbers
  initBoard() {
    this.getWord();     //starts the game with a new random word

    let board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

    for (let i = 0; i < this.state.word.length; i++) {
      board = this.placeRandom(board, this.state.word[i]);
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
    this.setState({ board, gameOver: false, message: null });
  }


  // Get all blank coordinates from board
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

  // Place random starting number on an empty coordinate
  placeRandom(board, letter) {
    const blankCoordinates = this.getBlankCoordinates(board);
    const randomCoordinate = blankCoordinates[Math.floor(Math.random() * blankCoordinates.length)];
    board[randomCoordinate[0]][randomCoordinate[1]] = letter;
    return board;
  }

  // Compares two boards to check for movement
  boardMoved(original, updated) {
    return JSON.stringify(updated) !== JSON.stringify(original) ? true : false;
  }

  // Moves board depending on direction and checks for game over
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
      //this.state.username = document.getElementById('username').value;
      if (this.state.username === '') {
        alert("Please write your name and press enter");
      } else { this.endGame(); }
    }
  }

  moveUp(inputBoard) {
    let rotatedRight = this.rotateRight(inputBoard);
    let board = rotatedRight;

    // Shift all numbers to the right
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

  moveRight(inputBoard) {
    let board = inputBoard;

    // Shift all numbers to the right
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

  moveDown(inputBoard) {
    let rotatedRight = this.rotateRight(inputBoard);
    let board = rotatedRight;

    // Shift all numbers to the left
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

  moveLeft(inputBoard) {
    let board = inputBoard;

    // Shift all numbers to the left
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

  // Check to see if there are any moves left
  checkForGameOver(board) {
    let i = 0;
    for (let c = 0; c < board.length; c++) {
      if (board[0][c] === this.state.word[c]) { i++; }
    }
    if (i === 4) { return true; }
    return false;
  }

  endGame() {
    document.getElementById('username').disabled = true;
    alert("Congratulations, you have won! Let's see the ranking");
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
      }
      xmlhttp.open("GET", "http://127.0.0.1/sad/ranking.php?usuari=" + this.state.username + "&punts=" + this.state.moves, true);
      xmlhttp.send();
      window.location.href = "http://127.0.0.1/sad/ranking2.php";
      //this.initBoard(this.state.word);
    }
    /*fetch('http://10.192.207.216/sad/ranking.php?usuari=' + this.state.username + '&punts=' + this.state.moves)
      .then((response) => {
        return response.json();  //it returns another Promise processed in the next then      
      })
      .then((res)=> {
        //console.log('ha entrado en la segunda premisa');
        res.map(item => (
          this.setState({ word: item.word })
        ))        
      })*/

  }

  componentWillMount() {    //Ran before the component is rendered
    this.initBoard();
    const body = document.querySelector('body');
    body.addEventListener('keydown', this.handleKeyDown.bind(this));

  }

  handleKeyDown(e) {
    const up = 38;
    const right = 39;
    const down = 40;
    const left = 37;
    const enter= 13;
    //const s = 83;

    if (e.keyCode === up) {
      this.move('up');
    } else if (e.keyCode === right) {
      this.move('right');
    } else if (e.keyCode === down) {
      this.move('down');
    } else if (e.keyCode === left) {
      this.move('left');
    }else if (e.keyCode === enter){
      this.move('');      //'enter' after the username is wrote
    }
    
    /*else if (e.keyCode === s) {
      this.initBoard();
    }*/
  }

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

const Row = ({ row }) => {
  return /*#__PURE__*/(
    React.createElement("tr", null,
      row.map((cell, i) => /*#__PURE__*/React.createElement(Cell, { key: i, cellValue: cell }))));


};

const Cell = ({ cellValue }) => {
  let value = cellValue === 0 ? '' : cellValue;
  let color = 'cell';


  return /*#__PURE__*/(
    React.createElement("td", null, /*#__PURE__*/
      React.createElement("div", { className: color }, /*#__PURE__*/
        React.createElement("div", { className: "letter" }, value))));
};


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('main'));