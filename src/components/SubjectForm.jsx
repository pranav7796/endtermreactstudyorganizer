import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { addSubject } from '../services/api'

function SubjectForm() {
  const { dispatch } = useAppContext()
  
  const [subject, setSubject] = useState({
    name: '',
    description: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!subject.name.trim()) {
      newErrors.name = 'Subject name is required'
    } else if (subject.name.length < 3) {
      newErrors.name = 'Subject name must be at least 3 characters'
    }
    
    if (!subject.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setSubject(prev => ({ ...prev, [name]: value }))
    
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
      // Add random color class
      const colors = [
        'bg-blue-100 text-blue-800',
        'bg-purple-100 text-purple-800',
        'bg-green-100 text-green-800',
        'bg-yellow-100 text-yellow-800',
        'bg-pink-100 text-pink-800',
        'bg-indigo-100 text-indigo-800'
      ]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      
      const subjectWithColor = {
        ...subject,
        color: randomColor
      }
      
      const newSubject = await addSubject(subjectWithColor)
      dispatch({ type: 'ADD_SUBJECT', payload: newSubject })
      
      // Reset form
      setSubject({
        name: '',
        description: ''
      })
      
      // Show success message
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
    } catch (error) {
      console.error('Error adding subject:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">Add New Subject</h3>
      
      {showSuccess && (
        <div className="bg-success-500 text-white p-3 rounded-md mb-4 animate-fade-in">
          Subject added successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="form-label">Subject Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={subject.name}
            onChange={handleChange}
            placeholder="e.g., Mathematics, History"
            className={`form-input ${errors.name ? 'border-error-500 focus:ring-error-500' : ''}`}
            disabled={isSubmitting}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={subject.description}
            onChange={handleChange}
            rows="3"
            placeholder="Brief description about this subject"
            className={`form-input ${errors.description ? 'border-error-500 focus:ring-error-500' : ''}`}
            disabled={isSubmitting}
          ></textarea>
          {errors.description && <p className="error-message">{errors.description}</p>}
        </div>
        
        <button 
          type="submit" 
          className={`btn btn-primary w-full ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Subject...' : 'Add Subject'}
        </button>
      </form>
    </div>
  )
}

export default SubjectForm