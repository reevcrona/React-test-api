import { useState,useEffect } from 'react'

import './App.css'

function App() {
  
  const [data, setData] = useState([]);


  const fetchData = () => {
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }
  
  useEffect(() => {
    
    fetchData();
      
  }, []);

  console.log(data)

  return (
    
      <div className='main-container'>
      <h2>API response {JSON.stringify(data)}</h2>
      <h2>You can also take a look in the console</h2>
      {data &&
        <img className="api-img" src ={data.message}></img>
        
      }
        
        <h3>Status: {data.status}</h3>
        <button onClick={fetchData}>Click me for new dog :)</button>
      </div>
        
  )
}

export default App
