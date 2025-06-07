import React from 'react'
import { useEffect, useState } from 'react'
import { checkheading,replaceheadingStarts } from '../helper'

const Answers=({ans,totalResult,index}) => {
    const [heading,setHeading] = useState(false);
    const [answer,setAnswer] = useState(ans);
 console.log(index);
    useEffect(()=>{
        if(checkheading(ans)){
            setHeading(true);
            setAnswer(replaceheadingStarts(ans));
        }
    },[])

     
  return (
    <>
      
      {
        index==0 && totalResult>1 ?<span className='pt-2 text-xl block text-white'>{answer}</span>:
        heading?<span className={ "pt-2 text-lg block text-white"}>{answer}</span>
        :<span className='pl-5 text-sm'>{answer}</span>
    }
    </>
  )
}

export default Answers
