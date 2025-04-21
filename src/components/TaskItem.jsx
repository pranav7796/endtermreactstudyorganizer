import { useState } from 'react'
import { FaTrash, FaRegCheckCircle, FaCheckCircle, FaClock } from 'react-icons/fa'
import { useAppContext } from '../context/AppContext'
import { toggleTask, removeTask } from '../services/api'

function TaskItem({ task, subjectName }) {
  const { dispatch } = useAppContext()
  const [isChecking, setIsChecking] = useState(false)
  
  const handleToggleComplete = async () => {
    setIsChecking(true)
    try {
      await toggleTask(task.id)
      dispatch({ type: 'TOGGLE_TASK', payload: task.id })
    } catch (error) {
      console.error('Error toggling task:', error)
    } finally {
      setIsChecking(false)
    }
  }
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await removeTask(task.id)
        dispatch({ type: 'REMOVE_TASK', payload: task.id })
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }
  
  // Calculate days remaining
  const daysRemaining = () => {
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Due today'
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`
  }
  
  const getDueDateColor = () => {
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'text-error-500'
    if (diffDays <= 2) return 'text-warning-500'
    return 'text-gray-500'
  }
  
  return (
    <div className={`card group ${task.completed ? 'bg-gray-50' : 'bg-white'} mb-3`}>
      <div className="flex items-start">
        <button 
          className={`mt-1 mr-3 text-xl ${task.completed ? 'text-success-500' : 'text-gray-300 hover:text-gray-500'} transition-colors duration-200 ${isChecking ? 'animate-spin' : ''}`}
          onClick={handleToggleComplete}
          disabled={isChecking}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed ? <FaCheckCircle /> : <FaRegCheckCircle />}
        </button>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            <button 
              onClick={handleDelete}
              className="text-gray-400 hover:text-error-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Delete task"
            >
              <FaTrash />
            </button>
          </div>
          
          <div className="mt-1 text-sm">
            <span className="bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full text-xs">
              {subjectName}
            </span>
            <span className={`flex items-center text-xs ml-2 inline-block mt-1 ${getDueDateColor()}`}>
              <FaClock className="mr-1" />
              {daysRemaining()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskItem