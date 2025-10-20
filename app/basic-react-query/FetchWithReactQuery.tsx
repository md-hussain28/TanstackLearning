import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { fetchData } from '@/lib/fetch-utils'
import { Card,CardHeader,CardTitle } from '@/components/ui/card'
import { Post } from '../api/posts/data'
const fetchPosts=()=>{
   
}

const FetchWithReactQuery = ({category}:{category:string}) => {

   const {data:posts,isPending,isError}=useQuery<Post[]>({
       queryKey:["Posts",category],
       queryFn: ()=>fetchData<Post[]>(`/api/posts?category=${category}`),
       staleTime:0,

   })
  
  if(isPending){
    return <div><p>Loading</p></div>
  }

  if(isError||posts==undefined){
    return (
    <div>
      <p>Error occured</p>
    </div>
    )
  }
 
  
  return (
    <div className='p-2'>
       {
        posts.map((p)=>(
           <Card key={p.id} className='p-2'>
            <CardTitle>{p.title}</CardTitle>
            <CardHeader>{p.body}</CardHeader>
           </Card>
        ))
       }
    </div>
  )
}

export default FetchWithReactQuery
