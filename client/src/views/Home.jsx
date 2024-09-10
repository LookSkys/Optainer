import React from 'react'
import ThreeMap from '../components/ThreeMap'
import Sidebar from '../components/SideBar/SideBar'

const Home = () => {
  return (
    <section className=''>
        <Sidebar className= "d-none d-lg-block"/> 
        <div className=''>
            <ThreeMap />
        </div>
    </section>
  )
}

export default Home
