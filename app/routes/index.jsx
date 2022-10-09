import { useState, useEffect }  from "react"

export default function Index() {
  const [count, setCount] = useState(0);
  const [wordCheck, setWordCheck] = useState('')
  const [playerCount, setPlayerCount] = useState(0)
  const [players, setPlayers] = useState('')
  const [time, setTime] = useState(0)
  const [isTimer, setIsTimer] = useState(false)
  const [intervalID, setIntervalID] = useState()

  useEffect(() => {
    setPlayerCount(+localStorage.getItem('player-count'))
    setPlayers(localStorage.getItem('players'))
    if (localStorage.startTime?.length > 1) {
      setIsTimer(true)
      resumeStopWatch()
    }
  }, [])

  useEffect(() => {
    if (+playerCount > 0) {
      localStorage.setItem("player-count", playerCount)
    }
  }, [playerCount])

  useEffect(() => {
    if (players?.length > 0) {
      localStorage.setItem("players", players)
    }
  }, [players])

  useEffect(() => {
    if (players?.length > 0) {
      localStorage.setItem("players", players)
    }
  }, [players])

  const resumeStopWatch = () => {
    const myInterval = setInterval(() => {
        const storageTime = new Date(window.localStorage.getItem('startTime'));
        const secsDiff = new Date().getTime() - storageTime.getTime();
        setTime(Math.floor(secsDiff / 1000))
      }, 1000);
    setIntervalID(myInterval)
  }

  const startStopWatch = () => {
    setIsTimer(true)
    window.localStorage.setItem('startTime', new Date());
    const storageTime = new Date(window.localStorage.getItem('startTime'));
    const myInterval = setInterval(() => {
        const secsDiff = new Date().getTime() - storageTime.getTime();
        setTime(Math.floor(secsDiff / 1000))
      }, 1000);
    setIntervalID(myInterval)
    }
    
  const resetTime = () => {
    if (intervalID) {
      clearInterval(intervalID)
      setIsTimer(false)
      setTime(0)
      localStorage.startTime = '0'
    }
  } 

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
      return <>This is a scrabble word! <a className="link-txt" target='_blank' rel='noreferrer' href={`${wordCheck[0].sourceUrls[0]}`}>Meaning</a></>
    } else if (wordCheck?.message) {
      return <span className='not-a-word'>This is not a scrabble word!</span>
    } 
      else return ''
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
    playerNames.forEach(name => name.value.length ? names.push(name.value) : '')
    const toNum = +playerCount
    if (names.length !== +toNum) {
      playerNames.forEach(name => name.value = '')
      alert("You must fill out a name for every player")
      return
    }
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
    setPlayers(storageNames)
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
          key={i}
          type="text" 
          className="player-name" 
          maxLength="9"
          placeholder="name"
        />
      )
    }
    return playerNameArr
  }

  function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}

  const renderPlayerBoxes = () => {
    const playerBoxes = []
    const parsedPlayers = JSON.parse(players)
    const scoresArr = parsedPlayers.map(player => Number(playerScore(player)))
    const gameStart = scoresArr.every(score => score === 0)
    const leadIndex = indexOfMax(scoresArr)

    for (let i = 0; i < parsedPlayers.length; i++) {
      let scoreClass = ''
      if (!gameStart && i === leadIndex) {
        scoreClass = 'lead-score'
      } 
      const tileArr =[]
      for (let j = 0; j < parsedPlayers[i].length; j++) {
        tileArr.push(
          <div className="tile" key={[j]} data-letter={parsedPlayers[i][j]}></div>
        )
      }
      playerBoxes.push(
        <div key={parsedPlayers[i]} score={playerScore(parsedPlayers[i])}>
        <div className="rack">
        {tileArr}
        </div>
        <p className="score">SCORE: <span className={scoreClass}>{playerScore(parsedPlayers[i])}</span></p>
          <form className="score-form" onSubmit={e => e.preventDefault()}>
        <div className="score-block">
          <input id="score-input" className={`btn inputs ${parsedPlayers[i]} word-input`} type="number"/>
          <div className="score-btns">
            <button type='submit' onClick={() => setPlayerScore(parsedPlayers[i])} className="score-btn">Add</button>
            <button onClick={() => clearScore(parsedPlayers[i])} className="score-btn clear-btn">Clear</button>
          </div>
        </div>
          </form>
        <hr />
        </div>
      )
    }
    return playerBoxes
  }

  return (
    <>
    <div style={{ lineHeight: "1.4" }}>
      <div className="timer">
      <div className="reset-game" onClick={() => resetGame()}>RESET game</div>
      { isTimer > 0 ?
      <>
        <div id="timerLabel">{time}</div>
        <div onClick={() => resetTime()}>Clear Timer</div>
      </> 
        :
        <div onClick={() => startStopWatch()}>Start timer</div>
      }
      </div>
      <h1>SCRABBLE MASTER</h1>
      <div className="word-response">
        {generateWordResponse()}
      </div>
      <div className="word-checker">
      <input type="text" className="word-input" />
      <div 
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
      </div>
      </div>
      <hr />
      <div className="score-display">
        {players ? 
        renderPlayerBoxes()  
        :
        '' }
        { playerCount && !players ?
            <form className="name-inputs">
              {renderPlayerInputs()}
              <button
                type='submit'
                className="btn start-btn" 
                onClick={e => {
                e.preventDefault()
                const playerNames = document.querySelectorAll('.player-name')
                startGame(playerNames)
              }}>
                Start Game!
                </button>
          </form>
        : 
          players ? '' :
          <div className="count-box">
            <div className="dropdown-menu">
              <div className="dropdown-label">PLAYER COUNT</div>
              <select defaultValue="2" className='player-count btn' name="player-count" id="player-count">
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <button className="btn addplr-btn" onClick={() => {
              setPlayerCount(document.getElementById("player-count").value)
            }}
            >
              Add NAMES
            </button>
          </div>
        }
      </div>      
    </div>
  </>
  );
}

export function getStaticPaths() {
  return ["/"];
}
