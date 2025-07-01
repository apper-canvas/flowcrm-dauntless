import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'

const SearchBar = ({ 
  placeholder = "Search...",
  onSearch,
  className = ''
}) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    }
  }

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="pl-10 pr-4 py-2 bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </form>
  )
}

export default SearchBar