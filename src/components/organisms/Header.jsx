import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <ApperIcon name="Menu" size={24} />
        </Button>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-4">
          <SearchBar 
            placeholder="Search contacts, deals, tasks..."
            onSearch={(query) => console.log('Search:', query)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ApperIcon name="Bell" size={20} className="text-gray-600" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ApperIcon name="Settings" size={20} className="text-gray-600" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header