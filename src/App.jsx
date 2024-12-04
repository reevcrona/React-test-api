import { useState,useEffect } from 'react'
import axios from "axios";
import {nanoid} from "nanoid";
import he from "he";

import './App.css'

function App() {
  
  const [data, setData] = useState([]);
  const [apiToken,setApiToken] = useState(null)
  const [quizElements,setQuizElements] = useState([]);
  const [questionIndex,setQuestionIndex] = useState(0);
  const [questionActive,setQuestionActive] = useState(false);
  const [correctAnswers,setCorrectAnswers] = useState(0);
  
  useEffect(() => {
    fetchApiToken()
    
  },[])

  useEffect(() => {
    
    if(questionActive){
      renderQuizElements()
    }
  },[data],questionIndex)

  useEffect(() => {
    console.log(questionIndex)
  },[questionIndex])
  
  const updateQuestionIndex = () => {
    setQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex === data.length - 1 ? 0 : prevIndex + 1;
      if (nextIndex === 0) {
        fetchApiData(); // Fetch new data when the index resets to 0
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
    axios.get(`https://opentdb.com/api.php?amount=10&token=${apiToken}&type=multiple`).then((res) => {
      
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
        
        
    }else{
      console.log("Wrong answer")
     

    }
    
  }


  const renderQuizElements = () => {
     return setQuizElements(data.map((item,index) => {
        return (
          <div key={index}>
            <h2>{item.question}</h2>
            <button onClick={(e) => checkAnswer(e,index)} value={item.answers[0]}>{item.answers[0]}</button>
            <button onClick={(e) => checkAnswer(e,index)} value={item.answers[1]}>{item.answers[1]}</button>
            <button onClick={(e) => checkAnswer(e,index)} value={item.answers[2]}>{item.answers[2]}</button>
            <button onClick={(e) => checkAnswer(e,index)} value={item.answers[3]}>{item.answers[3]}</button>
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
        <h2>{correctAnswers}</h2>
        <button onClick={fetchApiData}>API QUESTION DATA</button>
        <button onClick={() => console.log(apiToken)}>Log Token</button>
        <button onClick={() => console.log(data)}>Log ARRAY</button>
        <button onClick={() => {renderQuizElements(),setQuestionActive(true)}}>RENDER ELEMETNS</button>
        <button onClick={() => console.log(questionIndex)}>LOG QUESTON INDEX</button>
        <button onClick={updateQuestionIndex}>ADD 1 TO QUESTION INDEX</button>

        {quizElements[questionIndex]}

        
      </div>
        
  )
}

export default App
