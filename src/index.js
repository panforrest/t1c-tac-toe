import './index.css' //import index.css from './index.css' 
import React from 'react'
import ReactDom from 'react-dom' 

function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i){
	  return (
  	  <Square 
        key = {i}
  	    value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
  	  />
	  ); 
  }

  render() {
    var wrapper = [];
    for (var i=0; i<=2; i++){
      var row = [];
      for (var j=3 * i; j<=3 * i + 2; j++){
        row.push(this.renderSquare(j));
      }
      wrapper.push(<div className="board-row" key={i}>{row}</div>);
    }
    return (
  	  <div>
        <div className="status">{/*status*/}</div>
        {wrapper}
  	  </div>
	);
  }
}

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        clickedLocation: [0, 0],
      }],
      stepNumber: 0,
      xIsNext: true,
      Sort: 0
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        clickedLocation: [Math.floor(i / 3) + 1, i % 3 + 1],
      }]), 
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  } 

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  } 

  toggleSort(){
    const sort = this.state.sort;
    this.setState({
      sort: ~ sort,
    })
  }

  render(){
    const history = this.state.history;
    const sort = this.state.sort;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const clickedLocation = step.clickedLocation
      const desc = move ? 'Move #' + move + ' (' + clickedLocation[0] + ',' + clickedLocation[1] + ')' : 'Game start';

      if (move === history.length - 1) {
        return (
          <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)} style={{fontWeight:"bold", fontSize:"22px"}} >{desc}</a> 
          </li>
        );
      }else {
        return (
          <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
          </li>
        );
      }
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

  	return(
  	  <div className="game">
  	    <div className="board-game">
  	      <Board
            squares={current.squares} 
            onClick={(i) => this.handleClick(i)}
          />
  	    </div>

  	    <div className="game-info">
            <div>{status}</div>
            <button onClick = {() => this.toggleSort()}> toggle btn </button>
            {(() => {
              return sort === 0 ? <ol> {moves} </ol> : <ol> {moves.reverse()} </ol>
            })()}
  	    </div>
  	  </div>
  	);
  }
}

ReactDom.render(<Game />, document.getElementById('root'))

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],    
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [0, 4, 6],
  ];
  for (let i=0; i<lines.length; i++){
  	const [a, b, c] = lines[i];
  	if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
  	  return squares[a];	
  	}
  }
  return null;
}

