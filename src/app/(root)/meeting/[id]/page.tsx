'use client'
import MeetingRoom from '@/components/MeetingRoom'
import MeetingSetup from '@/components/MeetingSetup'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import { useGetCallById } from '../../../../../hooks/useGetCallById'
import { useUser } from '@clerk/nextjs'
import Loader from '../../../../../components/Loader'
import { use } from 'react'

const Meeting = ({ params }: { params: Promise<{ id: string }> }) => {
  const {  isLoaded } = useUser()
  const [isSetupComplete, setIsSetupComplete] = useState(true)
  const resolvedParams = use(params) // Unwrap the Promise
  const { call, isCallLoading } = useGetCallById(resolvedParams.id)
  
  if (isCallLoading || !isLoaded) return <Loader />
  
  return (
    <main className='h-full w-full'>
      <StreamCall call={call}>
        <StreamTheme>
          {isSetupComplete ? (<MeetingSetup setIsSetupComplete={setIsSetupComplete} />) : (<MeetingRoom />)}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting
