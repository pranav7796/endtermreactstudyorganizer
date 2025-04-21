import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { addTask } from '../services/api'

function TaskForm() {
  const { state, dispatch } = useAppContext()
  const { subjects } = state
  
  const [task, setTask] = useState({
    title: '',
    subjectId: '',
    dueDate: '',
    completed: false
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!task.title.trim()) {
      newErrors.title = 'Task title is required'
    }
    
    if (!task.subjectId) {
      newErrors.subjectId = 'Please select a subject'
    }
    
    if (!task.dueDate) {
      newErrors.dueDate = 'Due date is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setTask(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const newTask = await addTask(task)
      dispatch({ type: 'ADD_TASK', payload: newTask })
      
      // Reset form
      setTask({
        title: '',
        subjectId: '',
        dueDate: '',
        completed: false
      })
      
      // Show success message
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
    } catch (error) {
      console.error('Error adding task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0]
  
  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">Add New Task</h3>
      
      {showSuccess && (
        <div className="bg-success-500 text-white p-3 rounded-md mb-4 animate-fade-in">
          Task added successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="form-label">Task Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={task.title}
            onChange={handleChange}
            placeholder="What do you need to do?"
            className={`form-input ${errors.title ? 'border-error-500 focus:ring-error-500' : ''}`}
            disabled={isSubmitting}
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="subjectId" className="form-label">Subject</label>
          <select
            id="subjectId"
            name="subjectId"
            value={task.subjectId}
            onChange={handleChange}
            className={`form-input ${errors.subjectId ? 'border-error-500 focus:ring-error-500' : ''}`}
            disabled={isSubmitting}
          >
            <option value="">Select a subject</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjectId && <p className="error-message">{errors.subjectId}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="dueDate" className="form-label">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            min={today}
            className={`form-input ${errors.dueDate ? 'border-error-500 focus:ring-error-500' : ''}`}
            disabled={isSubmitting}
          />
          {errors.dueDate && <p className="error-message">{errors.dueDate}</p>}
        </div>
        
        <button 
          type="submit" 
          className={`btn btn-primary w-full ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Task...' : 'Add Task'}
        </button>
      </form>
    </div>
  )
}

export default TaskForm