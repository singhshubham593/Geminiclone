import React from 'react'
import { useState } from 'react'
import './App.css'
import {URL} from './constants.js'

function App() {
   const [question,setQuestion] = useState('');
   const [result,setResult] = useState('');

  const payload ={
    "contents": [{
        "parts": [
          {
            "text":  question
          }
        ]
      }]
   }

   const askQuestion= async()=>{
    let response =await fetch(URL,{
      method:"POST",
      body:JSON.stringify(payload),
    })
    response = await response.json();
    //console.log(response.candidates[0].content.parts[0].text);
    setResult(response.candidates[0].content.parts[0].text);
   }

  return (
     <div className="grid grid-cols-5 h-screen text-center">
        <div className="col-span-1 bg-zinc-800"> hello</div>
        <div className='col-span-4 p-10'>
          <div className='container h-120 text-white overflow-scroll'>
            <div className=''>
              {result}
            </div>
          </div>
          <div className="bg-zinc-800 w-1/2 p-1 text-white m-auto rounded-4xl border border-zinc-700 flex h-16">
            <input type="text" value={question} onChange={(event)=> setQuestion(event.target.value)} className='w-full h-full p-3 outline-none' placeholder="Search Anything"/>
            <button onClick={askQuestion} className='mx-4 h-full py-2'>Ask</button>
          </div>
        </div>
     </div>
  )
}

export default App
