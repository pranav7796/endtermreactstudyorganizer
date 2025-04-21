import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import NoteCard from '../components/NoteCard'
import NoteForm from '../components/NoteForm'

function Notes() {
  const { state } = useAppContext()
  const { subjects, notes, isLoading, error } = state
  
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter notes based on subject and search query
  const getFilteredNotes = () => {
    let filteredNotes = [...notes]
    
    // Filter by subject
    if (subjectFilter !== 'all') {
      filteredNotes = filteredNotes.filter(note => note.subjectId === subjectFilter)
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      filteredNotes = filteredNotes.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query)
      )
    }
    
    // Sort notes by creation date (newest first)
    return filteredNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  
  const filteredNotes = getFilteredNotes()
  
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
          <p className="text-gray-600">Loading notes...</p>
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
      <h1 className="text-3xl font-bold mb-6">Notes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                />
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
          
          {filteredNotes.length === 0 ? (
            <div className="card bg-gray-50 border border-gray-200 text-center py-10">
              <p className="text-gray-500 mb-4">No notes found</p>
              <p className="text-gray-600">
                {notes.length === 0 
                  ? 'Add your first note to get started' 
                  : 'Try changing your filters or search query'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note}
                  subjectName={getSubjectName(note.subjectId)}
                />
              ))}
            </div>
          )}
        </div>
        
        <div>
          <NoteForm />
        </div>
      </div>
    </div>
  )
}

export default Notes