import { Link } from 'react-router-dom'
import { FaBook, FaTasks, FaStickyNote, FaChartLine } from 'react-icons/fa'
import { useAppContext } from '../context/AppContext'

function Home() {
  const { state } = useAppContext()
  const { subjects, tasks, notes, isLoading, error } = state
  
  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length
  const pendingTasks = tasks.length - completedTasks
  const taskCompletionRate = tasks.length > 0 
    ? Math.round((completedTasks / tasks.length) * 100) 
    : 0
  
  // Get upcoming tasks (due in the next 3 days)
  const today = new Date()
  const threeDaysLater = new Date(today)
  threeDaysLater.setDate(today.getDate() + 3)
  
  const upcomingTasks = tasks
    .filter(task => {
      const dueDate = new Date(task.dueDate)
      return dueDate <= threeDaysLater && !task.completed
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3)
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your study data...</p>
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to StudyPal</h1>
        <p className="text-gray-600 text-lg">Your personal study organizer</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-blue-50 border-l-4 border-primary-500">
          <div className="flex items-center">
            <FaBook className="text-2xl text-primary-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Subjects</h3>
              <p className="text-2xl font-bold">{subjects.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-purple-50 border-l-4 border-secondary-500">
          <div className="flex items-center">
            <FaTasks className="text-2xl text-secondary-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Tasks</h3>
              <p className="text-2xl font-bold">{tasks.length}</p>
              <div className="flex text-sm mt-1">
                <span className="text-success-500 mr-2">{completedTasks} done</span>
                <span className="text-warning-500">{pendingTasks} pending</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-green-50 border-l-4 border-success-500">
          <div className="flex items-center">
            <FaStickyNote className="text-2xl text-success-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Notes</h3>
              <p className="text-2xl font-bold">{notes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-yellow-50 border-l-4 border-warning-500">
          <div className="flex items-center">
            <FaChartLine className="text-2xl text-warning-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Completion Rate</h3>
              <p className="text-2xl font-bold">{taskCompletionRate}%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/subjects" className="card bg-primary-50 hover:bg-primary-100 transition-colors duration-300 text-center">
          <FaBook className="text-3xl text-primary-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Manage Subjects</h3>
          <p className="text-gray-600">Add, view, or remove your study subjects</p>
        </Link>
        
        <Link to="/tasks" className="card bg-secondary-50 hover:bg-secondary-100 transition-colors duration-300 text-center">
          <FaTasks className="text-3xl text-secondary-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Track Tasks</h3>
          <p className="text-gray-600">Create and manage your study tasks</p>
        </Link>
        
        <Link to="/notes" className="card bg-green-50 hover:bg-green-100 transition-colors duration-300 text-center">
          <FaStickyNote className="text-3xl text-success-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Take Notes</h3>
          <p className="text-gray-600">Write and organize your study notes</p>
        </Link>
      </div>
      
      {/* Upcoming Tasks Section */}
      <div className="card bg-white border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-4">Upcoming Tasks</h2>
        
        {upcomingTasks.length > 0 ? (
          <div className="space-y-3">
            {upcomingTasks.map(task => {
              const subject = subjects.find(s => s.id === task.subjectId) || { name: 'Unknown' }
              const dueDate = new Date(task.dueDate)
              const isToday = new Date().toDateString() === dueDate.toDateString()
              
              return (
                <div key={task.id} className="flex items-center p-3 border rounded-md hover:bg-gray-50">
                  <div className="mr-3">
                    <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-error-500' : 'bg-warning-500'}`}></div>
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-gray-500">{subject.name}</div>
                  </div>
                  <div className={`text-sm font-medium ${isToday ? 'text-error-500' : 'text-warning-500'}`}>
                    {isToday ? 'Today' : dueDate.toLocaleDateString()}
                  </div>
                </div>
              )
            })}
            
            <div className="mt-4 text-center">
              <Link to="/tasks" className="text-primary-500 hover:text-primary-700 font-medium">
                View all tasks →
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No upcoming tasks for the next 3 days</p>
            <Link to="/tasks" className="text-primary-500 hover:text-primary-700 mt-2 inline-block font-medium">
              Create a new task
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home