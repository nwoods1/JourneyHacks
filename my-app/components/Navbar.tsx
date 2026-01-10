export default function Navbar() {
    return (
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and App Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <h1 className="text-2xl font-bold">In The Loop</h1>
          </div>
  
          {/* Right side - Create Event Button and User Profile */}
          <div className="flex items-center gap-4">
            {/* Create Event Button */}
            <button className="btn btn-primary rounded-full px-6 py-2 bg-blue-300 hover:bg-blue-400 transition-colors">
              + Create Event
            </button>
  
            {/* User Profile */}
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">G</span>
              </div>
              <span className="font-medium">Grantley</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }