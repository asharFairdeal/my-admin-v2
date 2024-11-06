import React from 'react'
import Image from 'next/image'

function UnderProgress() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Coming Soon!</h1>
      <p className="text-gray-600 mb-6">
        We're working hard to bring you this feature. Stay tuned for updates!
      </p>
      <Image src="/work-in-progress.png" alt="Under Construction" width={300} height={200} className="mx-auto mb-6" />
      <button className="btn btn-primary">Notify Me!</button>
    </div>
  )
}

export default UnderProgress
