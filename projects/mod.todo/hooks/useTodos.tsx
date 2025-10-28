import {  useQuery } from '@tanstack/react-query'
import React from 'react'

const useTodos = () => {
     const data=useQuery({
      queryKey:["todo"],
      queryFn: async ()=>{
           const res =await fetch("/api/todo");
           if(!res.ok){throw new Error("Error in response")}
           
           const data=await res.json();
           return data;
      }
     })
}

export default useTodos
