import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/**
* This functions logic has been copied from bit.ly/s-pcs
*/
var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const DoneFrame = (props) => {
	return (
  	<div className="text-center">
  	  <h2>{props.doneStatus}</h2>
      <button className="btn-lg btn-secondary" onClick={props.resetGame}>Play Again</button>
  	</div>
  );
}
const Stars = (props) => {
	// const numberOfStars = 1 + Math.floor(Math.random()*9);

  let stars = [];

	return (
  	<div className="col-5">
  	  {[...Array(props.numberOfStars).keys()].map(i=>
      	<i key={i} className="fa fa-star"></i>
      )}
  	</div>
  );
}

const Button = (props) => {
	let button ;

  switch(props.answerIsCorrect) {
  	case true:
    	button =
      <button className="btn-lg btn-success"
      				onClick={props.acceptAnswer} >
          <i className="fa fa-check"></i>
      </button>
    	break;
    case false:
    	button =
      <button className="btn-lg btn-danger">
          <i className="fa fa-times"></i>
      </button>
    	break;
    default:
    	button =
      <button className="btn-lg"
      		onClick={props.checkAnswer}
      		disabled={props.selectedNumbers.length === 0}>
      	=
      </button>
    	break;
  }

	return (
  	<div className="col-2 text-center">
  	  {button}
      <br />
      <br />
      <button className="btn-sm btn-warning" onClick={props.redraw}
      				disabled={props.redraws === 0}>
        <i className="fa fa-sync"></i>
        &nbsp;{props.redraws}
      </button>
  	</div>
  );
}

const Answer = (props) => {
	return (
  	<div className="col-5">
  	  {props.selectedNumbers.map((number, i)=>
      	<span key={i}
        onClick={() => props.unSelectNumber(number)} >
        	{number}
        </span>
      )}
  	</div>
  );
}

const Numbers = (props) => {
	let getNumbersClassName = (number) => {
  	if(props.usedNumbers.indexOf(number) >= 0) {
    	return 'used';
    }
  	if(props.selectedNumbers.indexOf(number) >= 0) {
    	return 'selected';
    }
  }

	return (
  	<div className="card text-center">
  	  <div>
  	    {Numbers.list.map((number, i)=>
        	<span key={i} className={getNumbersClassName(number)}
          onClick={()=> props.selectNumber(number)}>
          {number}</span>
        )}
  	  </div>
  	</div>
  );
}
Numbers.list = [...Array(9).keys()].map(x=> ++x);

class Game extends React.Component {
	state= {
  	selectedNumbers: [],
    randomNumberOfStars: 1 + Math.floor(Math.random()*9),
    answerIsCorrect: null,
    usedNumbers: [],
    redraws: 5,
    doneStatus: null
  };

  selectNumber = (clickedNumber) => {
  	if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0 ||
    		this.state.usedNumbers.indexOf(clickedNumber) >= 0) {
    	return ;
    }
  	this.setState(prevState => ({
    	answerIsCorrect: null,
    	selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }));
  };

  unselectNumber = (clickedNumber) => {
  	this.setState(prevState => ({
    	answerIsCorrect: null,
    	selectedNumbers: prevState.selectedNumbers.filter((number) => number !== clickedNumber)
    }));
  };

  checkAnswer = () => {
  	this.setState(prevState => ({
    	answerIsCorrect: prevState.randomNumberOfStars ===
      	prevState.selectedNumbers.reduce((acc, n) => acc + n , 0)
    }));
  };

  acceptAnswer = () => {
  	this.setState(prevState => ({
    	usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      randomNumberOfStars: 1 + Math.floor(Math.random()*9)
    }), this.updateDoneStatus);
  };

  redraw = () => {
  	this.setState(prevState => ({
    	selectedNumbers: [],
    	randomNumberOfStars: 1 + Math.floor(Math.random()*9),
    	answerIsCorrect: null,
      redraws: --prevState.redraws
    }), this.updateDoneStatus);
  };

  possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
  	const possibleNumbers = [...Array(9).keys()].map(x=> ++x).filter(number =>
    	usedNumbers.indexOf(number) === -1
    );

    return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
  };

  updateDoneStatus = () => {
  	this.setState(prevState => {
    	if(prevState.usedNumbers.length === 9) {
      	return {doneStatus: 'Done, Nice!' }
      }

      if(prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
      	return {doneStatus: 'Game Over!'}
      }

    });
  };

  resetGame = () => {
  	this.setState({
    	selectedNumbers: [],
      randomNumberOfStars: 1 + Math.floor(Math.random()*9),
      answerIsCorrect: null,
      usedNumbers: [],
      redraws: 5,
      doneStatus: null
    });
  }

	render() {
  	const {selectedNumbers, randomNumberOfStars, answerIsCorrect, usedNumbers, redraws, doneStatus} = this.state;
  	return (
    	<div className="container">
    	  <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars} />
        	<Button selectedNumbers={selectedNumbers}
          				checkAnswer = {this.checkAnswer}
                  acceptAnswer = {this.acceptAnswer}
                  answerIsCorrect = {answerIsCorrect}
                  redraw = {this.redraw}
                  redraws = {redraws}/>
        	<Answer selectedNumbers={selectedNumbers}
          				unSelectNumber={this.unselectNumber} />
        </div>
        <br />
        {
        doneStatus ?<DoneFrame resetGame={this.resetGame} doneStatus={doneStatus} />:
                    <Numbers selectedNumbers={selectedNumbers}
                            usedNumbers = {usedNumbers}
                            selectNumber={this.selectNumber} />
        }
    	</div>
    );
  }
}

class App extends React.Component {
	render() {
  	return (
    	<div>
    	  <Game />
    	</div>
    );
  }
}

export default App;
