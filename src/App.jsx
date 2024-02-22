import { ThemeProvider } from 'styled-components'
import './App.css'
import { useState } from 'react';
import { darkTheme, lightTheme } from './theme';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Forget from './components/ForgetPassword/Forget';
import SetPassword from './components/SetPasswordPage/SetPassword';

function App() {

  const [theme, settheme] = useState("light");

  // const themeToggler = () => {
  //   theme === "light" ? settheme("dark") : settheme("light");
  // };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <div className='App'>
        <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/forgetpassword' element={<Forget />} />
          <Route path='/setnewpassword/:token' element={<SetPassword />} />
        </Routes>
        </BrowserRouter>
      </div>

    </ThemeProvider>
  )
}

export default App
