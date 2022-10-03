const { useState, useEffect } = require("react")

export default function Index() {
  let savedScore = typeof window !== 'undefined' ? localStorage.getItem('score1') : null
  let savedScore2 = typeof window !== 'undefined' ? localStorage.getItem('score2') : null
  // let player1 = typeof window !== 'undefined' ? localStorage.getItem('player1') : null
  // let player2 = typeof window !== 'undefined' ? localStorage.getItem('player2') : null
  const [score, setScore] = useState(savedScore || 0);
  const [holdingScore, setHoldingScore] = useState(score);
  // const [playerOne, setPlayerOne] = useState(score);

  const [score2, setScore2] = useState(savedScore || 0);
  const [holdingScore2, setHoldingScore2] = useState(score);

  // useEffect(() => {
  //   setScore(savedScore)
  //   setScore2(savedScore2)
  // }, [])
  
  const addScore = () => {
    localStorage.setItem("score1", holdingScore)
    savedScore = typeof window !== 'undefined' ? localStorage.getItem('score1') : null
    setScore(holdingScore)
    const scoreInput = document.getElementById("score-input")
    scoreInput.value = ""
  }
  
  const clearScore = () => {
    localStorage.setItem("score1", 0)
    savedScore = typeof window !== 'undefined' ? localStorage.getItem('score1') : null
    setScore(0)
    setHoldingScore(0)
    const scoreInput = document.getElementById("score-input")
    scoreInput.value = ""
  }
  
  const addScore2 = () => {
    localStorage.setItem("score2", holdingScore2)
    savedScore2 = typeof window !== 'undefined' ? localStorage.getItem('score2') : null
    setScore2(holdingScore2)
    const scoreInput = document.getElementById("score-input2")
    scoreInput.value = ""
  }
  
  const clearScore2 = () => {
    localStorage.setItem("score2", 0)
    savedScore2 = typeof window !== 'undefined' ? localStorage.getItem('score2') : null
    setScore2(0)
    setHoldingScore2(0)
    const scoreInput = document.getElementById("score-input2")
    scoreInput.value = ""
  }

  return (
    <div style={{ lineHeight: "1.4" }}>
      <h1>SCRABBLE Score Tracker</h1>
      <div className="score-display">
        <hr />
        <div class="rack">
          <div class="tile" data-letter="o"></div>
          <div class="tile" data-letter="l"></div>
          <div class="tile" data-letter="y"></div>
          <div class="tile" data-letter="a"></div>
          <span className="score">: {score > 0 ? score : savedScore}</span>
        </div>
        <div className="score-block">
          <input id="score-input" className="inputs" type="number" onChange={e => setHoldingScore(score + (+e.target.value))} />
          <button onClick={() => addScore()} className="add-score">Add</button>
          <button onClick={() => clearScore()} className="add-score">Clear</button>
        </div>
        <hr />
        <div class="rack">
          <div class="tile" data-letter="t"></div>
          <div class="tile" data-letter="y"></div>
        <span className="score">: {score2 > 0 ? score2 : savedScore2}</span>
        </div>
        <div className="score-block">
          <input id="score-input2" className="inputs" type="number" onChange={e => setHoldingScore2(score2 + (+e.target.value))} />
          <button onClick={() => addScore2()} className="add-score">Add</button>
          <button onClick={() => clearScore2()} className="add-score">Clear</button>
        </div>
        <hr />
      </div>
      <div className="word-checker">

      </div>
    </div>
  );
}
