const { useState, useEffect } = require("react")
const { Button } = require("@mui/material")


export default function Index() {
  // let savedScore = typeof window !== 'undefined' ? localStorage.getItem('score1') : null
  // let savedScore2 = typeof window !== 'undefined' ? localStorage.getItem('score2') : null
  let savedScore
  let savedScore2
  
  const [score, setScore] = useState(0);
  const [holdingScore, setHoldingScore] = useState(score);
  
  const [score2, setScore2] = useState(0);
  const [holdingScore2, setHoldingScore2] = useState(score);
  
  const [wordCheck, setWordCheck] = useState()
  
  useEffect(() => {
    let savedScore = localStorage.getItem('score1')
    let savedScore2 = localStorage.getItem('score2')
    setScore(+savedScore)
    setScore2(+savedScore2)
  }, [])
  
  const addScore = () => {
    localStorage.setItem("score1", (+holdingScore + +score))
    savedScore =  localStorage.getItem('score1')
    setScore(savedScore)
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
    localStorage.setItem("score2", (+holdingScore2 + +score2))
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
  
  const generateURL = (wordToCheck) => {
    
    // const API = {
    //   CORS: 'https://cors-anywhere.herokuapp.com/',
    //   baseURL: 'http://www.wordgamedictionary.com/api/v1/references/scrabble/',
    //   key: '7.304453775081076e29',
    // }
    // //takes in a word and returns a properly formatted URL for the API
    //   return API.CORS + API.baseURL + wordToCheck + '?key=' + API.key;
    // }
    const API = {
      // CORS: 'https://cors-anywhere.herokuapp.com/',
      baseURL: `https://api.dictionaryapi.dev/api/v2/entries/en/${wordToCheck}`,
      // key: '7.304453775081076e29',
    }
    //takes in a word and returns a properly formatted URL for the API
      return API.baseURL
    }

  const callAPI = async (word) =>  {
      //generate a URL for the specified word, then call the fetch API
      const response = await fetch(generateURL(word), { method: 'get' })
      //get the response in a string format
      const parsedResponse = await response.json();
      return parsedResponse
      // const parsedResponse = await response.text()
      // const toXML = window !== undefined ? (await (new window.DOMParser()).parseFromString(parsedResponse, "text/xml")) : ''
      // return toXML
  }

  const generateWordResponse = () => {
    if (wordCheck?.length) {
      return <>This is a scrabble word! <a target='_blank' rel='noreferrer' href={`${wordCheck[0].sourceUrls[0]}`}>Meaning</a></>
    } else if (wordCheck?.message) {
      return 'This is not a scrabble word!'
    } 
      else return ''
  }

  return (
    <>
    <div style={{ lineHeight: "1.4" }}>
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
        <div className="rack">
          <div className="tile" data-letter="o"></div>
          <div className="tile" data-letter="l"></div>
          <div className="tile" data-letter="y"></div>
          <div className="tile" data-letter="a"></div>
        </div>
        <p className="score">SCORE: {score > 0 ? score : savedScore}</p>
        <div className="score-block">
          <input id="score-input" className="inputs" type="number" onChange={e => setHoldingScore(+e.target.value)} />
          <div className="add-btn">
            <button onClick={() => addScore()} className="add-score">Add</button>
          </div>
          <div className="clear-btn">
            <button onClick={() => clearScore()} className="add-score">Clear</button>
          </div>
        </div>
        <hr />
        <div className="rack">
          <div className="tile" data-letter="t"></div>
          <div className="tile" data-letter="y"></div>
        </div>
        <p className="score">SCORE: {score2 > 0 ? score2 : savedScore2}</p> 
        <div className="score-block">
          <input id="score-input2" className="inputs" type="number" onChange={e => setHoldingScore2(score2 + (+e.target.value))} />
          <button onClick={() => addScore2()} className="add-score">Add</button>
          <button onClick={() => clearScore2()} className="add-score">Clear</button>
        </div>
        <hr />
      </div>
    </div>
  </>
  );
}
