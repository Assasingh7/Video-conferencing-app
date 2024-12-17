import React from 'react'
import StreamVideoProvider from '../../../providers/StreamClientProvider'
// import { Toaster } from '@/components/ui/toaster'
const RootLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <main>
        
<StreamVideoProvider>
{children}
{/* <Toaster/> */}

</StreamVideoProvider>
      
        
        
        </main>
  )
}

export default RootLayout