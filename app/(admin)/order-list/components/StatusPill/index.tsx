import React from 'react'

interface StatusPillProps {
  status: string
}

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  // Define the color classes for each status
  const statusColors: { [key: string]: string } = {
    COMPLETED: 'bg-green-100 text-green-800 border-green-400',
    PROCESSED: 'bg-yellow-100 text-yellow-800 border-yellow-400',
    READY_TO_PICKUP: 'bg-blue-100 text-blue-800 border-blue-400',
    NEW: 'bg-red-100 text-red-800 border-red-400',
  }

  // Get the color class for the current status, or fallback to a default color
  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-400'

  return (
    <div className={`rounded-full border w-fit px-4 py-1 text-sm ${colorClass}`}>
      {status}
    </div>
  )
}

export default StatusPill