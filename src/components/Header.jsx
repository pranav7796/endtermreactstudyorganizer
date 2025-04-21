import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBook, FaTasks, FaStickyNote, FaBars, FaTimes, FaHome } from 'react-icons/fa'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-primary-500 font-semibold' : 'text-gray-600 hover:text-primary-500'
  }
  
  const navLinks = [
    { path: '/', name: 'Home', icon: <FaHome className="mr-2" /> },
    { path: '/subjects', name: 'Subjects', icon: <FaBook className="mr-2" /> },
    { path: '/tasks', name: 'Tasks', icon: <FaTasks className="mr-2" /> },
    { path: '/notes', name: 'Notes', icon: <FaStickyNote className="mr-2" /> }
  ]
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <FaBook className="text-primary-500 text-2xl mr-2" />
            <span className="text-xl font-bold text-gray-800">StudyPal</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center transition-colors duration-200 ${isActive(link.path)}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-500 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <ul className="space-y-3">
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${isActive(link.path)}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header