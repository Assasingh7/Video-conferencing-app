'use client'
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

const EndCallButton = () => {
    const call=useCall()
    const router=useRouter()
    const {useLocalParticipant}=useCallStateHooks()
    // const localParticipant=useLocalParticipant()
    const participant = useLocalParticipant();
    const meetingOwner=participant && call?.state.createdBy && participant.userId===call?.state.createdBy.id
    if(!meetingOwner)return null
  return (
    <Button onClick={async ()=>{
        await call.endCall()
        router.push('/')
    }} className='bg-red-500'>
        End Call for everyone
    </Button>
  )
}

export default EndCallButton