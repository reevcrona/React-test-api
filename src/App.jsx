import { useState,useEffect } from 'react'
import axios from "axios";
import {nanoid} from "nanoid";
import he from "he";

import './App.css'

function App() {
  
  const [data, setData] = useState([]);
  const [apiToken,setApiToken] = useState(null)
  
  const [questionIndex,setQuestionIndex] = useState(0);
  const [gameIsActive,setGameIsActive] = useState(false);
  
  const [isGameOver,setIsGameOver] = useState(false);
  const [roundIsOver,setRoundIsOver] = useState(false)
  
  const [correctAnswers,setCorrectAnswers] = useState(0);
  const [playerLives,setPlayLives] = useState(3);

  const [timer,setTimer] = useState(10);
  
  
    useEffect(() => {
      
      if(timer === 0 || !gameIsActive) return;
  
      const timerTimeout = setTimeout(() => {
        if(roundIsOver){
         clearTimeout(timerTimeout)
        }
        else{
          setTimer((prevState) => prevState - 1)
        }
          
      },1000)
  
  
      return () => clearTimeout(timerTimeout)
    },[timer,gameIsActive,roundIsOver])
  
    
    
  useEffect(() => {
    fetchApiToken()
    
  },[])

  useEffect(() => {
    if(apiToken){
      fetchApiData()
    }
  },[apiToken])

  
  const updateQuestionIndex = () => {
    setTimer(10);
    setQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex === data.length - 1 ? 0 : prevIndex + 1;
      if (nextIndex === 0) {
        fetchApiData(); 
      }
      return nextIndex;
    });
    
  }

  const shuffleArray = (array) => {
    for(let i = array.length -1; i > 0; i--){

      const randomIndex = Math.floor(Math.random() * (i + 1));

      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];

    }
    return array;
  }
  
  const fetchApiData = () => {
    axios.get(`https://opentdb.com/api.php?amount=5&token=${apiToken}&type=multiple`).then((res) => {
      
      console.log(res.data)
      const dataResponse = res.data.results;

      setData(dataResponse.map((item) => {

        
        const deCodedCorrectAnswer = he.decode(item.correct_answer);
        const decodedIncorrectAnswers = item.incorrect_answers.map((answer) => he.decode(answer))

        const shuffledAnswers = shuffleArray([deCodedCorrectAnswer,...decodedIncorrectAnswers])
        

        return {
          id:nanoid(),
          correctAnswer:deCodedCorrectAnswer,
          answers:shuffledAnswers,
          question:he.decode(item.question)
        }

      }))
    })
  }
  
  const checkAnswer = (e,index) => {
    const {value} = e.target;

    if(value === data[index].correctAnswer){
        console.log("correct answer")
        setCorrectAnswers((prevState) => prevState + 1);
        setRoundIsOver(true)
        
    }else{
      console.log("Wrong answer")
      setRoundIsOver(true)
      setPlayLives((prevState) => {
        if(prevState -1 === 0){
          setIsGameOver(true)
          return prevState - 1
        }else{
          return prevState - 1
          
        }
      })
      
    }
    
  }


  const renderQuizElements = () => {
    const currentQuestion = data[questionIndex];  
    if (!currentQuestion) return null; 
    return (
      <div key={questionIndex}>
        <h2>{currentQuestion.question}</h2>
        {currentQuestion.answers.map((answer, id) => (
          <button key={id} onClick={(e) => checkAnswer(e, questionIndex)} value={answer}>
            {answer}
          </button>
        ))}
      </div>
    );      
  }
  
  
  
  const fetchApiToken = () => {
    axios.get("https://opentdb.com/api_token.php?command=request").then((res) => {
        setApiToken(res.data.token)
    })
  }


  
  return (
    
      <div className='main-container'>
        <h2>{timer}</h2>
        {isGameOver && <h1>GAME IS OVER</h1>}
        <h2>CORRECT ANSWERS:{correctAnswers}</h2>
        <h2>PLAYER LIVES :{playerLives}</h2>
        <button onClick={() => {setGameIsActive(true)}}>Start Quiz</button>
        {gameIsActive && !isGameOver ? renderQuizElements(): null}
        {roundIsOver && !isGameOver ? <button onClick={() => {updateQuestionIndex(),setRoundIsOver(false)}}>Next question</button>:null}
        
      </div>
        
  )
}

export default App
