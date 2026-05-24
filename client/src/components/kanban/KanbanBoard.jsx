import React from 'react';
import PropTypes from 'prop-types';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ tasks, onTaskClick, onTaskMove }) {
  const columns = [
    { title: '📋 To Do', status: 'ToDo' },
    { title: '⚡ In Progress', status: 'InProgress' },
    { title: '🔍 Review', status: 'Review' },
    { title: '✅ Completed', status: 'Completed' }
  ];

  const handleDrop = (e, targetStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId && onTaskMove) {
      onTaskMove(taskId, targetStatus);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      alignItems: 'start',
      overflowX: 'auto',
      paddingBottom: '16px'
    }}>
      {columns.map(col => {
        const colTasks = tasks.filter(task => task.status === col.status);
        return (
          <KanbanColumn
            key={col.status}
            title={col.title}
            status={col.status}
            tasks={colTasks}
            onTaskClick={onTaskClick}
            onDrop={handleDrop}
          />
        );
      })}
    </div>
  );
}

KanbanBoard.propTypes = {
  tasks: PropTypes.array.isRequired,
  onTaskClick: PropTypes.func.isRequired,
  onTaskMove: PropTypes.func.isRequired,
};
