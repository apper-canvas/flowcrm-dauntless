import { forwardRef } from 'react'

const Select = forwardRef(({ 
  label,
  error,
  options = [],
  className = '',
  ...props 
}, ref) => {
  const selectClasses = `
    w-full px-3 py-2 border rounded-lg text-sm bg-white
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    transition-all duration-200
    ${error 
      ? 'border-red-300 text-red-900' 
      : 'border-gray-300 text-gray-900 hover:border-gray-400'
    }
    ${className}
  `
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={selectClasses}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select