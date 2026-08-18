import {RouterProvider} from "react-router-dom"
import {useLenis} from "@/hooks"
import {router} from "@/app"
export const App=()=>{
   useLenis()
  return(
    <RouterProvider router={router} />
  )
}