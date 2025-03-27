import { useState, FormEvent } from "react";
import { useAppContext } from "@/lib/context";
import { useLocation } from "wouter";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const { translate, searchQuery, setSearchQuery } = useAppContext();
  const [quickSearches] = useState<string[]>(['3009', '过温', '急停', '通讯故障']);
  const [, setLocation] = useLocation();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    
    // If it looks like an error code (mostly numeric), navigate directly to the error detail page
    if (/^\d+$/.test(searchQuery.trim()) || /^\d+[A-Za-z]$/.test(searchQuery.trim())) {
      setLocation(`/error/${searchQuery.trim()}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    onSearch(term);
    
    // If quick search term is an error code, navigate to its details
    if (/^\d+$/.test(term.trim()) || /^\d+[A-Za-z]$/.test(term.trim())) {
      setLocation(`/error/${term.trim()}`);
    }
  };

  return (
    <section className="bg-white border-b border-gray-200 p-4 md:p-6 sticky top-0 md:top-0 z-10 shadow-sm">
      <div className="relative max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input 
              type="text" 
              placeholder={translate('search_placeholder')}
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-gray-500">search</span>
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {searchQuery && (
                <button 
                  type="button"
                  className="text-gray-400 hover:text-gray-600 mr-2" 
                  onClick={clearSearch}
                >
                  <span className="material-icons">close</span>
                </button>
              )}
              <button 
                type="submit"
                className="text-primary-600 hover:text-primary-800" 
              >
                <span className="material-icons">arrow_forward</span>
              </button>
            </div>
          </div>
        </form>
        <div className="mt-2 flex flex-wrap gap-2">
          {quickSearches.map((term, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
            >
              {index === 0 ? `${translate('common_searches')}: ` : ''} 
              <span className={index === 0 ? "font-bold ml-1" : ""}>{term}</span>
              <button 
                className="ml-1 text-gray-500 hover:text-gray-700"
                onClick={() => handleQuickSearch(term)}
              >
                <span className="material-icons text-sm">add_circle_outline</span>
              </button>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
