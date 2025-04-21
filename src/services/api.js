import axios from 'axios'

// Using JSONPlaceholder as a mock API
const API_URL = 'https://jsonplaceholder.typicode.com'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Initialize local storage with default data if empty
function initializeLocalStorage() {
  if (!localStorage.getItem('subjects')) {
    localStorage.setItem('subjects', '[]')
  }
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', '[]')
  }
  if (!localStorage.getItem('notes')) {
    localStorage.setItem('notes', '[]')
  }
}

initializeLocalStorage()

// Fetch all subjects
export async function fetchSubjects() {
  try {
    const subjects = JSON.parse(localStorage.getItem('subjects') || '[]')
    return subjects
  } catch (error) {
    console.error('Error fetching subjects:', error)
    throw error
  }
}

// Add a new subject
export async function addSubject(subject) {
  try {
    const subjects = JSON.parse(localStorage.getItem('subjects') || '[]')
    const newSubject = {
      ...subject,
      id: Date.now()
    }
    subjects.push(newSubject)
    localStorage.setItem('subjects', JSON.stringify(subjects))
    return newSubject
  } catch (error) {
    console.error('Error adding subject:', error)
    throw error
  }
}

// Remove a subject
export async function removeSubject(id) {
  try {
    const subjects = JSON.parse(localStorage.getItem('subjects') || '[]')
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const notes = JSON.parse(localStorage.getItem('notes') || '[]')
    
    // Remove subject
    const filteredSubjects = subjects.filter(subject => subject.id !== id)
    localStorage.setItem('subjects', JSON.stringify(filteredSubjects))
    
    // Remove related tasks and notes
    const filteredTasks = tasks.filter(task => task.subjectId !== id)
    const filteredNotes = notes.filter(note => note.subjectId !== id)
    
    localStorage.setItem('tasks', JSON.stringify(filteredTasks))
    localStorage.setItem('notes', JSON.stringify(filteredNotes))
    
    return id
  } catch (error) {
    console.error('Error removing subject:', error)
    throw error
  }
}

// Fetch all tasks
export async function fetchTasks() {
  try {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    return tasks
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

// Add a new task
export async function addTask(task) {
  try {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const newTask = {
      ...task,
      id: Date.now()
    }
    tasks.push(newTask)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    return newTask
  } catch (error) {
    console.error('Error adding task:', error)
    throw error
  }
}

// Toggle task completion status
export async function toggleTask(id) {
  try {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    )
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    return id
  } catch (error) {
    console.error('Error toggling task:', error)
    throw error
  }
}

// Remove a task
export async function removeTask(id) {
  try {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const filteredTasks = tasks.filter(task => task.id !== id)
    localStorage.setItem('tasks', JSON.stringify(filteredTasks))
    return id
  } catch (error) {
    console.error('Error removing task:', error)
    throw error
  }
}

// Fetch all notes
export async function fetchNotes() {
  try {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]')
    return notes
  } catch (error) {
    console.error('Error fetching notes:', error)
    throw error
  }
}

// Add a new note
export async function addNote(note) {
  try {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]')
    const newNote = {
      ...note,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    notes.push(newNote)
    localStorage.setItem('notes', JSON.stringify(notes))
    return newNote
  } catch (error) {
    console.error('Error adding note:', error)
    throw error
  }
}

// Remove a note
export async function removeNote(id) {
  try {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]')
    const filteredNotes = notes.filter(note => note.id !== id)
    localStorage.setItem('notes', JSON.stringify(filteredNotes))
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
