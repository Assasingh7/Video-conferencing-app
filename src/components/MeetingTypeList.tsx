/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
// import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from './ui/textarea'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Input } from './ui/input'
const TypedDatePicker = DatePicker as React.ComponentType<any>
const MeetingTypeList = () => {
    const router=useRouter()
    const [meetingState, setMeetingState] = useState<'isSchedulingMeeting' | 'isJoiningMeeting' | 'isInstantMeeting'|undefined>()
    const {user}=useUser()
    const [values,setValues]=useState({
      dateTime:new Date(),
      description:'',
      link:''
    })
    const {toast}=useToast()
    
    const [callDetails,setCallDetails]=useState<Call>()
    const creatingMeeting=async()=>{
      if(!client || !user) return
      try {
        if(!values.dateTime){
          toast({
         title:'Please select a date and time'   
          })
          return
        }
        const id=crypto.randomUUID()
        const call=client.call('default',id)
        if(!call) throw new Error('Failed to create call')
          const startsAt=values.dateTime.toISOString() || new Date(Date.now()).toISOString()
        const description=values.description || 'Instant Meeting'
        await call.getOrCreate({
          data:{
            starts_at:startsAt,
            custom:{
              description
            }
          }
        })
        setCallDetails(call)
        if(!values.description){
          router.push(`/meeting/${call.id}`)
        }
        toast({
          title:'Meeting created successfully',
        })
      } catch (e) {
        console.log(e);
        toast({
          title:'Failed to create meeting'
        })
        
      }

    }
    const client=useStreamVideoClient()
    const meetingLink=`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard
        img="/icons/add-meeting.svg" 
        title="New Meeting"
        description="Start an instant Meeting"
        handleClick={()=>setMeetingState('isInstantMeeting')}
        className="bg-orange-1"
        />
        <HomeCard
                img="/icons/schedule.svg" 
                title="Schedule Meeting"
                description="Plan your meeting"
                handleClick={()=>setMeetingState('isSchedulingMeeting')}
        className="bg-blue-1"/>

        <HomeCard
                img="/icons/add-meeting.svg" 
                title="View Recordings"
                description="Check out your recordings"
                handleClick={()=>router.push('/recordings')}
        className="bg-purple-1"
        />

        <HomeCard   img="/icons/join-meeting.svg" 
        title="Join Meeting"
        description="...have an invitation link"
        handleClick={()=>setMeetingState('isJoiningMeeting')}
        className="bg-yellow-1"
        />
        {!callDetails?(
          <MeetingModal
          isOpen={meetingState==='isSchedulingMeeting'}
        onClose={()=>setMeetingState(undefined)}
        title='Create Meeting'

        handleClick={creatingMeeting}>
          <div className='flex flex-col gap-2.5'>
            <label className='text-base text-normal leading-[22px] text-sky-1' >Add a description</label>
            <Textarea className='border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0 ' onChange={(e)=>{
              setValues({...values,description:e.target.value})
            }}/>
          </div>
          <div className='flex w-full flex-col gap-2.5'>
          <label className='text-base text-normal leading-[22px] text-sky-1' >Select Date and Time</label>
         


          <TypedDatePicker selected={values.dateTime} onChange={(dat:Date)=>setValues({...values,dateTime:dat||new Date()})}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className='text-blue-1 bg-dark-2 rounded p-2 w-full focus:outline-none'
            />

          </div>
        </MeetingModal>
):(
  <MeetingModal
        isOpen={meetingState==='isSchedulingMeeting'}
        onClose={()=>setMeetingState(undefined)}
        title='Meeting Created'
        className="text-center"
        buttonText='Copy Meeting Link'
        handleClick={()=>{
          navigator.clipboard.writeText(meetingLink)
          toast({
            title: 'Link copied',
          })
        }}
        image='/icons/checked.svg'
        buttonIcon='/icons/copy.svg'
        />
)}
        <MeetingModal
        isOpen={meetingState==='isInstantMeeting'}
        onClose={()=>setMeetingState(undefined)}
        title='Start an Instant Meeting'
        className="text-center"
        buttonText='Start Meeting'
        handleClick={creatingMeeting}
        />
           <MeetingModal
        isOpen={meetingState==='isJoiningMeeting'}
        onClose={()=>setMeetingState(undefined)}
        title='Type Meeting Link'
        className="text-center"
        buttonText='Join Meeting'
        handleClick={()=>{
          router.push((values.link||'').trim())
        }}
        >
          <Input placeholder='Meeting Link' onChange={(e)=>setValues({...values,link:e.target.value})} className='bg-dark-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0'/>
        </MeetingModal>
    </section>
  )
}

export default MeetingTypeList