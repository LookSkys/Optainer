import React from 'react'
import ThreeMap from '../components/ThreeMap'
import Sidebar from '../components/SideBar/SideBar'

const Home = () => {
  return (
    <section>
        <Sidebar className= "d-none d-lg-block"/> 
        <div>
            <ThreeMap />
        </div>
    </section>
  )
}

export default Home
