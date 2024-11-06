import React from 'react'


const InfinityLoader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <span style={{fontSize: '40rem', color: 'blue'}} className="loading loading-infinity loading-lg daisyui-spinner daisyui-spinner-lg daisyui-spinner-accent"></span>
    </div>
  )
}

export default InfinityLoader

