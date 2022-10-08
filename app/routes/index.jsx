const { useState, useEffect } = require("react")
const { Button } = require('@mui/material');

export default function Index() {
  const [count, setCount] = useState(0);
  const [wordCheck, setWordCheck] = useState()
  const [playerCount, setPlayerCount] = useState()
  const [players, setPlayers] = useState()

  useEffect(() => {
    let playerCount = localStorage.getItem('player-count')
    let players = localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')) : ''
    setPlayers(players)
    setPlayerCount(+playerCount)
  }, [])
  
  
  const generateURL = (wordToCheck) => {
    const API = {
      baseURL: `https://api.dictionaryapi.dev/api/v2/entries/en/${wordToCheck}`,
    }
      return API.baseURL
    }

  const callAPI = async (word) =>  {
      const response = await fetch(generateURL(word), { method: 'get' })
      const parsedResponse = await response.json();
      return parsedResponse
  }

  const generateWordResponse = () => {
    if (wordCheck?.length > 0) {
      return <>This is a scrabble word! <a target='_blank' rel='noreferrer' href={`${wordCheck[0].sourceUrls[0]}`}>Meaning</a></>
    } else if (wordCheck?.message) {
      return 'This is not a scrabble word!'
    } 
      else return ''
  }

  const localSetPlayerCount = (playerCount) => {
    localStorage.setItem("player-count", playerCount)
    setPlayerCount(playerCount)
  }

  const playerScore = (player) => {
    const score = localStorage.getItem(player)
    if (score) return score
    else return 0
  }
  
  const setPlayerScore = (player) => {
    const playerEl = document.querySelector(`.${player}`)
    const score = playerEl.value
    localStorage.setItem(player, (+score + +playerScore(player)))
    playerEl.value = ''
    setCount(count + 1)
  }
  
  const clearScore = (player) => {
    localStorage.setItem(player, 0)
    setCount(count + 1)
  }

  const startGame = (playerNames) => {
    let names = []
    playerNames.forEach(name => names.push(name.value))
    for ( let val of names) {
      var matches = val.match(/\d+/g);
      if (matches != null) {
        playerNames.forEach(name => name.value = '')
        alert('Name must not contain numbers');
        return
      }
    }
    const duplicateElements = names.filter((item, index) => names.indexOf(item) !== index)
    if (duplicateElements.length > 0) {
      playerNames.forEach(name => name.value = '')
      alert('Names must be unique');
      return
    }
    const storageNames = JSON.stringify(names)
    localStorage.setItem('players', storageNames)
    setPlayers(names)
  }

  const resetGame = () => {
    localStorage.clear()
    location.reload()
  }

  const renderPlayerInputs = () => {
    const playerNameArr = []
    for (let i = 0; i < playerCount; i++) {
      playerNameArr.push(
        <input 
          type="text" 
          className="player-name" 
          maxLength="9"
          placeholder="name"
        />
      )
    }
    return playerNameArr
  }

  const renderPlayerBoxes = () => {
    const playerBoxes = []
    for (let player of players) {
      const tileArr =[]
      for (let i = 0; i < player.length; i++) {
        tileArr.push(
          <div className="tile" data-letter={player[i]}></div>
        )
      }
      playerBoxes.push(
        <>
        <div className="rack">
        {tileArr}
        </div>
        <p className="score">SCORE: {playerScore(player)}</p>
        <div className="score-block">
          <input id="score-input" className={`inputs ${player}`} type="number"/>
          <div className="add-btn">
            <button onClick={() => setPlayerScore(player)} className="add-score">Add</button>
          </div>
          <div className="clear-btn">
            <button onClick={() => clearScore(player)} className="add-score">Clear</button>
          </div>
        </div>
        <hr />
        </>
      )
    }
    return playerBoxes
  }

  return (
    <>
    <div style={{ lineHeight: "1.4" }}>
      <div className="reset-game" onClick={() => resetGame()}>RESET</div>
      <h1>SCRABBLE MASTER</h1>
      <div className="word-checker">
      <input type="text" className="word-input" />
      <Button 
        variant="text" 
        onClick={async () => {
          const wordInput = document.querySelector(".word-input")
          const response = await callAPI(wordInput.value)
          setWordCheck(response)
          wordInput.value = ''
        }
      }
      className="submit-word"
      >
        Check word
      </Button>
      </div>
      <div className="word-response">
        {generateWordResponse()}
      </div>
      <hr />
      <div className="score-display">
        {players ? 
        renderPlayerBoxes()  
        :
        '' }
        { playerCount && !players ?
            <div className="name-inputs">
              {renderPlayerInputs()}
              <button onClick={async () => {
                const playerNames = document.querySelectorAll('.player-name')
                startGame(playerNames)
              }}>
                Start Game!
                </button>
          </div>
        : 
          players ? '' :
          <div className="count-box">
            <label for="player-count">Player count:</label>
            <select name="player-count" id="player-count">
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <button className="btn" onClick={() => {
              localSetPlayerCount(document.getElementById("player-count").value)
            }}
            >
              Add players
            </button>
          </div>
        }
      </div>
    </div>
  </>
  );
}
