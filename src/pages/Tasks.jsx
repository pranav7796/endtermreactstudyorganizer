import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import TaskItem from '../components/TaskItem'
import TaskForm from '../components/TaskForm'

function Tasks() {
  const { state } = useAppContext()
  const { subjects, tasks, isLoading, error } = state
  
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'completed'
  const [subjectFilter, setSubjectFilter] = useState('all')
  
  // Filter tasks based on current filters
  const getFilteredTasks = () => {
    let filteredTasks = [...tasks]
    
    // First filter by status
    if (filter === 'pending') {
      filteredTasks = filteredTasks.filter(task => !task.completed)
    } else if (filter === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed)
    }
    
    // Then filter by subject
    if (subjectFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.subjectId === subjectFilter)
    }
    
    // Sort tasks by due date (closest first)
    return filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  }
  
  const filteredTasks = getFilteredTasks()
  
  // Get subject name by id
  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId)
    return subject ? subject.name : 'Unknown'
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-error-500 text-white p-4 rounded-md">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    )
  }
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFilter('all')} 
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter === 'all' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({tasks.length})
                </button>
                <button 
                  onClick={() => setFilter('pending')} 
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter === 'pending' 
                      ? 'bg-warning-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending ({tasks.filter(t => !t.completed).length})
                </button>
                <button 
                  onClick={() => setFilter('completed')} 
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter === 'completed' 
                      ? 'bg-success-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Completed ({tasks.filter(t => t.completed).length})
                </button>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Subject:</span>
                <select 
                  value={subjectFilter} 
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="form-input text-sm py-1 px-2"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="card bg-gray-50 border border-gray-200 text-center py-10">
                <p className="text-gray-500 mb-4">No tasks found</p>
                <p className="text-gray-600">
                  {tasks.length === 0 
                    ? 'Add your first task to get started' 
                    : 'Try changing your filters'}
                </p>
              </div>
            ) : (
              <div>
                {filteredTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task}
                    subjectName={getSubjectName(task.subjectId)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <TaskForm />
        </div>
      </div>
    </div>
  )
}

export default Tasks