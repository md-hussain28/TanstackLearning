// 'use client'

// import React, { useEffect, useState } from 'react'
// import { GetTodosResponse, Todo } from '../../utils/todo-types';
// import { Loader2,Repeat2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// const TodoDisplay = () => {
//    const [todos,setTodos]=useState<Todo[]>([]);
//    const [error,setError]=useState("");
//    const [loading,setLoading]=useState(true);
//    const [count,setCount]=useState(0)
//    useEffect(()=>{
//     setLoading(true);
//     setError("")
//          const fetchTodo=async ()=>{
//               try {
//                   const res=await fetch("/api/todo");
//                   if(!res.ok){
//                     throw new Error("Todo list response is not ok")
//                   }
//                   const data:GetTodosResponse=await res.json();
//                   console.log(data.data.todos)
//                   setTodos(data.data.todos)
//               } catch (error) {
//                  setError("Sorry there is an error")
                 
//               } finally {
//                 setLoading(false);
//               }
//          }
//          fetchTodo()
//    },[count])
   
  
//    const handleRetry=()=>{
//       setCount(p=>p+1);
//    }

//    if(loading){
//     return(
//       <div className='h-screen w-full flex justify-center items-center'>
//         <Loader2 className='animate-spin'/>
//       </div>
//     )
//    }
//    if(error!=""){
//        return(
//       <div className='h-screen w-full flex flex-col justify-center items-center gap-2'>
//          <p>{error}</p>
//          <Button onClick={handleRetry} variant={'secondary'}>
//            Retry
//           <Repeat2/>
//          </Button>
//       </div>
//     )
//    }
//   return (
//     <div className='p-4 border-2 gap-4 flex flex-col'>
//         {
//           todos.map((p)=>{
//             return (
//               <div key={p.id} className='w-full border-2 px-4 py-2'>
//                  <h4>{p.title}</h4>
//                  <p>{p.description}</p>
//               </div>
//             )
//           })
//         }
//     </div>
//   )
// }

// export default TodoDisplay


'use client'

import React, { useEffect, useState } from 'react'
import { GetTodosResponse, Todo } from '../../utils/todo-types';
import { Loader2,Repeat2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';


         


const TodoDisplay = () => {
    

   const {data:todos,isPending,isError,refetch}=useQuery({
    queryKey: ["todos"],
    queryFn: async ()=>{
         const res= await fetch("/api/todo")
         if(!res.ok){throw new Error("Error in response")}
         const data:GetTodosResponse=await res.json();
         return data
    }
  })
  
  
   const handleRetry=()=>{
     refetch();
   }

   if(isPending){
    return(
      <div className='h-screen w-full flex justify-center items-center'>
        <Loader2 className='animate-spin'/>
      </div>
    )
   }
   if(isError){
       return(
      <div className='h-screen w-full flex flex-col justify-center items-center gap-2'>
         <p>An error occured</p>
         <Button onClick={handleRetry} variant={'secondary'}>
           Retry
          <Repeat2/>
         </Button>
      </div>
    )
   }
  return (
    <div className='p-4 border-2 gap-4 flex flex-col'>
        {
          todos.data.todos.map((p)=>{
            return (
              <div key={p.id} className='w-full border-2 px-4 py-2'>
                 <h4>{p.title}</h4>
                 <p>{p.description}</p>
              </div>
            )
          })
        }
    </div>
  )
}

export default TodoDisplay
