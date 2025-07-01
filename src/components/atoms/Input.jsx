import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label,
  error,
  className = '',
  type = 'text',
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg text-sm
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    transition-all duration-200
    ${error 
      ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400' 
      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 hover:border-gray-400'
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
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input