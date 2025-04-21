import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { addNote } from '../services/api'

function NoteForm() {
  const { state, dispatch } = useAppContext()
  const { subjects } = state
  
  const [note, setNote] = useState({
    title: '',
    content: '',
    subjectId: '',
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!note.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (note.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }
    
    if (!note.content.trim()) {
      newErrors.content = 'Content is required'
    } else if (note.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters'
    }
    
    if (!note.subjectId) {
      newErrors.subjectId = 'Please select a subject'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setNote(prev => ({ ...prev, [name]: value }))
    
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
      const newNote = await addNote(note)
      dispatch({ type: 'ADD_NOTE', payload: newNote })
      
      // Reset form
      setNote({
        title: '',
        content: '',
        subjectId: '',
      })
      
      // Show success message
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
    } catch (error) {
      console.error('Error adding note:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">Add New Note</h3>
      
      {showSuccess && (
        <div className="bg-success-500 text-white p-3 rounded-md mb-4 animate-fade-in">
          Note added successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={note.title}
            onChange={handleChange}
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
            value={note.subjectId}
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
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            id="content"
            name="content"
            value={note.content}
            onChange={handleChange}
            rows="4"
            className={`form-input ${errors.content ? 'border-error-500 focus:ring-error-500' : ''}`}
            disabled={isSubmitting}
          ></textarea>
          {errors.content && <p className="error-message">{errors.content}</p>}
        </div>
        
        <button 
          type="submit" 
          className={`btn btn-primary w-full ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Note...' : 'Add Note'}
        </button>
      </form>
    </div>
  )
}

export default NoteForm