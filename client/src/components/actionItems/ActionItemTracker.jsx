import React from 'react'
import ActionItemList from './ActionItemList'

export default function ActionItemTracker({ tasks }) {
  return (
    <div className="action-item-tracker">
      <ActionItemList tasks={tasks} />
    </div>
  )
}
