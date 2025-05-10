import { React, useState } from 'react'
import './RegistrationPage.css'
import Login from '../components/Login/Login'
import SignUp from '../components/SignUp/SignUp'

function RegistrationPage() {
  const [mode, setMode] = useState(false)
  const modeHandler = ()=>setMode(!mode)
  
  return (
    <div className='registration-container' >
      { mode? <SignUp modeHandler={ modeHandler }/>: <Login modeHandler={ modeHandler }/> }
    </div>
  )
}

export default RegistrationPage