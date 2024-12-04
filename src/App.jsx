import { useState,useEffect } from 'react'
import axios from "axios";
import {nanoid} from "nanoid";

import './App.css'

function App() {
  
  const [data, setData] = useState([]);
  const [apiToken,setApiToken] = useState(null)
  const [quizElements,setQuizElements] = useState([]);
  const [questionIndex,setQuestionIndex] = useState(0);
  const [gameStarted,setGameStarted] = useState(false);
  
  useEffect(() => {
    fetchApiToken()
    
  },[])

  useEffect(() => {
    
    if(gameStarted){
      renderQuizElements()
    }
  },[data])

  const updateQuestionIndex = () => {
    if(questionIndex === data.length - 1){
      fetchApiData();
      setQuestionIndex(0)
      
      console.log(`Fetched new questions. Token:${apiToken}`)
      console.log(data)
    }else{
      setQuestionIndex((prevState) => prevState + 1)
      console.log(questionIndex)
    }
    
  }

  const shuffleArray = (array) => {
    for(let i = array.length -1; i > 0; i--){

      const randomIndex = Math.floor(Math.random() * (i + 1));

      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];

    }
    return array;
  }
  
  const fetchApiData = () => {
    axios.get(`https://opentdb.com/api.php?amount=10&token=${apiToken}&type=multiple`).then((res) => {
      
      console.log(res.data)
      const dataResponse = res.data.results;

      setData(dataResponse.map((item) => {
        const shuffledAnswers = shuffleArray([item.correct_answer,...item.incorrect_answers])
        
        return {
          id:nanoid(),
          correctAnswer:item.correct_answer,
          answers:shuffledAnswers,
          question:item.question
        }

      }))
    })
  }
  
  


  const renderQuizElements = (index) => {
     return setQuizElements(data.map((item,i) => {
        return (
          <div key={i}>
            <h2>{item.question}</h2>
            <button>{item.answers[0]}</button>
            <button>{item.answers[1]}</button>
            <button>{item.answers[2]}</button>
            <button>{item.answers[3]}</button>
          </div>
        )
      }))
  }
  
  
  const fetchApiToken = () => {
    axios.get("https://opentdb.com/api_token.php?command=request").then((res) => {
        setApiToken(res.data.token)
    })
  }


  
  return (
    
      <div className='main-container'>
        <button onClick={fetchApiData}>API QUESTION DATA</button>
        <button onClick={() => console.log(apiToken)}>Log Token</button>
        <button onClick={() => console.log(data)}>Log ARRAY</button>
        <button onClick={() => {renderQuizElements(),setGameStarted(true)}}>RENDER ELEMETNS</button>
        <button onClick={updateQuestionIndex}>ADD 1 TO QUESTION INDEX</button>

        {quizElements[questionIndex]}
      </div>
        
  )
}

export default App
