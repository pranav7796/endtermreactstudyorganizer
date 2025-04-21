import axios from 'axios'

// Using JSONPlaceholder as a mock API
// In a real app, you would replace these URLs with your actual API endpoints
const API_URL = 'https://jsonplaceholder.typicode.com'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Fetch all subjects
export async function fetchSubjects() {
  try {
    // Using JSONPlaceholder's users endpoint as a mock for subjects
    const response = await api.get('/users')
    
    // Transform the data to match our app's subject structure
    return response.data.slice(0, 5).map(user => ({
      id: user.id,
      name: user.name,
      description: `Study materials for ${user.name}`,
      color: getRandomColor()
    }))
  } catch (error) {
    console.error('Error fetching subjects:', error)
    throw error
  }
}

// Add a new subject
export async function addSubject(subject) {
  try {
    const response = await api.post('/users', subject)
    return {
      ...response.data,
      ...subject,
      id: Date.now() // Ensure unique ID in our frontend
    }
  } catch (error) {
    console.error('Error adding subject:', error)
    throw error
  }
}

// Remove a subject
export async function removeSubject(id) {
  try {
    await api.delete(`/users/${id}`)
    return id
  } catch (error) {
    console.error('Error removing subject:', error)
    throw error
  }
}

// Fetch all tasks
export async function fetchTasks() {
  try {
    // Using JSONPlaceholder's todos endpoint
    const response = await api.get('/todos')
    
    // Transform the data to match our app's task structure
    return response.data.slice(0, 10).map(todo => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      subjectId: (todo.id % 5) + 1, // Assign to subjects 1-5
      dueDate: getRandomFutureDate()
    }))
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

// Add a new task
export async function addTask(task) {
  try {
    const response = await api.post('/todos', task)
    return {
      ...response.data,
      ...task,
      id: Date.now() // Ensure unique ID in our frontend
    }
  } catch (error) {
    console.error('Error adding task:', error)
    throw error
  }
}

// Toggle task completion status
export async function toggleTask(id) {
  try {
    // First get the current task to toggle its status
    const currentTasks = await fetchTasks()
    const task = currentTasks.find(t => t.id === id)
    
    if (!task) throw new Error('Task not found')
    
    await api.patch(`/todos/${id}`, {
      completed: !task.completed
    })
    
    return id
  } catch (error) {
    console.error('Error toggling task:', error)
    throw error
  }
}

// Remove a task
export async function removeTask(id) {
  try {
    await api.delete(`/todos/${id}`)
    return id
  } catch (error) {
    console.error('Error removing task:', error)
    throw error
  }
}

// Fetch all notes
export async function fetchNotes() {
  try {
    // Using JSONPlaceholder's posts endpoint as a mock for notes
    const response = await api.get('/posts')
    
    // Transform the data to match our app's note structure
    return response.data.slice(0, 8).map(post => ({
      id: post.id,
      title: post.title.slice(0, 30),
      content: post.body,
      subjectId: (post.id % 5) + 1, // Assign to subjects 1-5
      createdAt: getRandomPastDate()
    }))
  } catch (error) {
    console.error('Error fetching notes:', error)
    throw error
  }
}

// Add a new note
export async function addNote(note) {
  try {
    const response = await api.post('/posts', note)
    return {
      ...response.data,
      ...note,
      id: Date.now(), // Ensure unique ID in our frontend
      createdAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error adding note:', error)
    throw error
  }
}

// Remove a note
export async function removeNote(id) {
  try {
    await api.delete(`/posts/${id}`)
    return id
  } catch (error) {
    console.error('Error removing note:', error)
    throw error
  }
}

// Helper function to generate random colors for subjects
function getRandomColor() {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Helper function to generate random future dates
function getRandomFutureDate() {
  const today = new Date()
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 14) + 1) // Random day in the next 2 weeks
  return futureDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
}

// Helper function to generate random past dates
function getRandomPastDate() {
  const today = new Date()
  const pastDate = new Date(today)
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * 30)) // Random day in the past month
  return pastDate.toISOString()
}