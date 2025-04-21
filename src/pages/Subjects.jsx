import { useAppContext } from '../context/AppContext'
import SubjectCard from '../components/SubjectCard'
import SubjectForm from '../components/SubjectForm'

function Subjects() {
  const { state } = useAppContext()
  const { subjects, tasks, notes, isLoading, error } = state
  
  // Get task and note counts for each subject
  const getTaskCount = (subjectId) => {
    return tasks.filter(task => task.subjectId === subjectId).length
  }
  
  const getNoteCount = (subjectId) => {
    return notes.filter(note => note.subjectId === subjectId).length
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subjects...</p>
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
      <h1 className="text-3xl font-bold mb-6">Subjects</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1">Your Subjects</h2>
            <p className="text-gray-600">Manage your study subjects</p>
          </div>
          
          {subjects.length === 0 ? (
            <div className="card bg-gray-50 border border-gray-200 text-center py-10">
              <p className="text-gray-500 mb-4">You don't have any subjects yet</p>
              <p className="text-gray-600">Add your first subject to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map(subject => (
                <SubjectCard 
                  key={subject.id} 
                  subject={subject} 
                  taskCount={getTaskCount(subject.id)}
                  noteCount={getNoteCount(subject.id)}
                />
              ))}
            </div>
          )}
        </div>
        
        <div>
          <SubjectForm />
        </div>
      </div>
    </div>
  )
}

export default Subjects