import { useState } from 'react'
import { FaTrash, FaCalendar, FaBook } from 'react-icons/fa'
import { useAppContext } from '../context/AppContext'
import { removeNote } from '../services/api'

function NoteCard({ note, subjectName }) {
  const { dispatch } = useAppContext()
  const [expanded, setExpanded] = useState(false)
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await removeNote(note.id)
        dispatch({ type: 'REMOVE_NOTE', payload: note.id })
      } catch (error) {
        console.error('Error deleting note:', error)
      }
    }
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  return (
    <div className="card group mb-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold mb-1">{note.title}</h3>
        <button 
          onClick={handleDelete}
          className="text-gray-400 hover:text-error-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
          aria-label="Delete note"
        >
          <FaTrash />
        </button>
      </div>
      
      <div className="mb-3 text-sm text-gray-600 flex items-center">
        <span className="flex items-center mr-3">
          <FaBook className="mr-1" />
          {subjectName}
        </span>
        <span className="flex items-center">
          <FaCalendar className="mr-1" />
          {formatDate(note.createdAt)}
        </span>
      </div>
      
      <div className={`text-gray-700 ${expanded ? '' : 'line-clamp-3'}`}>
        {note.content}
      </div>
      
      {note.content.length > 150 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary-500 hover:text-primary-700 text-sm mt-2 font-medium"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}

export default NoteCard