import Image from 'next/image'
//import styles from './page.module.css'
import { Navbar } from './components/Navbar'

import { UserCreation } from './components/Login'

export default function Home() {
  return (
    <div>
      <Navbar />
      <header className='header text-center'>
        <h1>App name here</h1>
      </header>

      <UserCreation />
    </div>
  )
}
