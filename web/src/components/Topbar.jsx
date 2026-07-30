import { Menu, Bell } from 'lucide-react';
import { useLocation } from 'react-router';
import useUser from '../hooks/auth/useUser';

const Topbar = ({ setIsMobileMenuOpen }) => {
  const location = useLocation();
  const user = useUser();

  let pageTitle = 'Executive Dashboard';

  if (location.pathname.includes('client')) pageTitle = 'Client Portfolio Directory';
  if (location.pathname.includes('project')) pageTitle = 'Active Projects Hub';
  if (location.pathname.includes('task')) pageTitle = 'Task Execution & Assignments';

  return (
    <header className="h-16 px-4 md:px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-100 capitalize">
            {pageTitle}
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            ProjectPulse Admin • Overview & Workflow Real-time Analytics
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* <button className="text-slate-400 hover:text-slate-200">
           <Bell className="w-5 h-5" />
        </button> */}

        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Alex Morgan"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</p>
            <p className="text-[10px] text-indigo-400 font-medium">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;