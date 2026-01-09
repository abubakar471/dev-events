import { events, EventType } from '@/lib/constants'
import React from 'react'
import EventCard from '../event-card/EventCard'

const EventsContainer = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10'>
        {
            events.map((event : EventType) => (
                <EventCard key={event.id} {...event} />
            ))
        }
    </div>
  )
}

export default EventsContainer