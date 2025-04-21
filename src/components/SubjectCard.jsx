import { FaTrash, FaTasks, FaStickyNote } from 'react-icons/fa'
import { useAppContext } from '../context/AppContext'
import { removeSubject } from '../services/api'

function SubjectCard({ subject, taskCount, noteCount }) {
  const { dispatch } = useAppContext()
  
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${subject.name}? This will also delete all related tasks and notes.`)) {
      try {
        await removeSubject(subject.id)
        dispatch({ type: 'REMOVE_SUBJECT', payload: subject.id })
      } catch (error) {
        console.error('Error deleting subject:', error)
      }
    }
  }
  
  return (
    <div className={`card group ${subject.color} transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold mb-1">{subject.name}</h3>
        <button 
          onClick={handleDelete}
          className="text-gray-400 hover:text-error-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
          aria-label={`Delete ${subject.name}`}
        >
          <FaTrash />
        </button>
      </div>
      
      <p className="text-sm mb-4 line-clamp-2">{subject.description}</p>
      
      <div className="flex justify-between text-sm text-gray-600">
        <div className="flex items-center">
          <FaTasks className="mr-1" />
          <span>{taskCount} tasks</span>
        </div>
        <div className="flex items-center">
          <FaStickyNote className="mr-1" />
          <span>{noteCount} notes</span>
        </div>
      </div>
    </div>
  )
}

export default SubjectCard