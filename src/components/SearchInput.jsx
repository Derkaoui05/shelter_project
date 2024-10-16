import React from 'react'
import { Search } from 'lucide-react'

const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <>

    <div className="relative my-4 w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 p-2 mt-2 ml-2 caret-cyan-700 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
      />
      <div className="absolute left-3 top-1/2 pt-2 transform -translate-y-1/2 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
    </div>
    </>

  )
}

export default SearchInput