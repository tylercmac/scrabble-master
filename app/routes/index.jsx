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
      return <>This is a scrabble word! <a target='_blank' rel='noreferrer' href={`${wordCheck[0].sourceUrls[0]}`}>Meaning</a></>
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

  const renderPlayerBoxes = () => {
    const playerBoxes = []
    const parsedPlayers = JSON.parse(players)
    for (let player of parsedPlayers) {
      const tileArr =[]
      for (let i = 0; i < player.length; i++) {
        tileArr.push(
          <div className="tile" key={[i]} data-letter={player[i]}></div>
        )
      }
      playerBoxes.push(
        <div key={player}>
        <div className="rack">
        {tileArr}
        </div>
        <p className="score">SCORE: {playerScore(player)}</p>
        <div className="score-block">
          <input id="score-input" className={`btn inputs ${player}`} type="number"/>
            <button onClick={() => setPlayerScore(player)} className="btn add-btn">Add</button>
            <button onClick={() => clearScore(player)} className="btn clear-btn">Clear</button>
        </div>
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
              <button
                className="btn start-btn" 
                onClick={async () => {
                const playerNames = document.querySelectorAll('.player-name')
                startGame(playerNames)
              }}>
                Start Game!
                </button>
          </div>
        : 
          players ? '' :
          <div className="count-box">
            <select defaultValue="Player Count" className='player-count' name="player-count" id="player-count">
              <option disabled hidden >Player Count</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <button className="btn addplr-btn" onClick={() => {
              setPlayerCount(document.getElementById("player-count").value)
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

export function getStaticPaths() {
  return ["/"];
}
