import { useState, useEffect } from 'react';
import { Home, Briefcase, Receipt, FileText, Menu } from 'lucide-react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Projects } from './components/Projects';
import { Expenses } from './components/Expenses';
import { Bills } from './components/Bills';
import { More } from './components/More';

// Types
interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  status: 'active' | 'completed' | 'on-hold';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  progress: number;
}

interface Expense {
  id: string;
  projectId: string;
  projectName: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
}

interface Bill {
  id: string;
  projectId: string;
  projectName: string;
  vendor: string;
  billNumber: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
}

interface Payment {
  id: string;
  projectId: string;
  amount: number;
  status: 'pending' | 'received';
  date: string;
}

// LocalStorage keys
const STORAGE_KEYS = {
  AUTHENTICATED: 'contractor_app_authenticated',
  USERNAME: 'contractor_app_username',
  PROJECTS: 'contractor_app_projects',
  EXPENSES: 'contractor_app_expenses',
  BILLS: 'contractor_app_bills',
  PAYMENTS: 'contractor_app_payments',
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'expenses' | 'bills' | 'more'>('dashboard');

  // State with localStorage
  const [projects, setProjects] = useState<Project[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const authenticated = localStorage.getItem(STORAGE_KEYS.AUTHENTICATED) === 'true';
    const storedUsername = localStorage.getItem(STORAGE_KEYS.USERNAME) || '';
    
    if (authenticated && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }

    // Load data
    const loadedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    const loadedExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const loadedBills = localStorage.getItem(STORAGE_KEYS.BILLS);
    const loadedPayments = localStorage.getItem(STORAGE_KEYS.PAYMENTS);

    if (loadedProjects) setProjects(JSON.parse(loadedProjects));
    if (loadedExpenses) setExpenses(JSON.parse(loadedExpenses));
    if (loadedBills) setBills(JSON.parse(loadedBills));
    if (loadedPayments) setPayments(JSON.parse(loadedPayments));
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    }
  }, [projects, isAuthenticated]);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    }
  }, [expenses, isAuthenticated]);

  // Save bills to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
    }
  }, [bills, isAuthenticated]);

  // Save payments to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    }
  }, [payments, isAuthenticated]);

  // Handle login
  const handleLogin = (user: string) => {
    setIsAuthenticated(true);
    setUsername(user);
    localStorage.setItem(STORAGE_KEYS.AUTHENTICATED, 'true');
    localStorage.setItem(STORAGE_KEYS.USERNAME, user);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    localStorage.removeItem(STORAGE_KEYS.AUTHENTICATED);
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
    setActiveTab('dashboard');
  };

  // Project handlers
  const handleAddProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: Date.now().toString()
    };
    setProjects([...projects, newProject]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    // Also delete related expenses and bills
    setExpenses(expenses.filter(e => e.projectId !== id));
    setBills(bills.filter(b => b.projectId !== id));
    setPayments(payments.filter(p => p.projectId !== id));
  };

  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  // Expense handlers
  const handleAddExpense = (expense: Omit<Expense, 'id' | 'projectName'>) => {
    const project = projects.find(p => p.id === expense.projectId);
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      projectName: project?.name || 'Unknown Project'
    };
    setExpenses([...expenses, newExpense]);
    
    // Update project spent amount
    if (project) {
      handleUpdateProject(project.id, { spent: project.spent + expense.amount });
    }
  };

  const handleDeleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      const project = projects.find(p => p.id === expense.projectId);
      if (project) {
        handleUpdateProject(project.id, { spent: Math.max(0, project.spent - expense.amount) });
      }
    }
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Bill handlers
  const handleAddBill = (bill: Omit<Bill, 'id' | 'projectName' | 'status'>) => {
    const project = projects.find(p => p.id === bill.projectId);
    
    // Determine status based on due date
    const today = new Date();
    const dueDate = new Date(bill.dueDate);
    const status = dueDate < today ? 'overdue' : 'pending';
    
    const newBill = {
      ...bill,
      id: Date.now().toString(),
      projectName: project?.name || 'Unknown Project',
      status: status as 'pending' | 'paid' | 'overdue'
    };
    setBills([...bills, newBill]);
  };

  const handleUpdateBillStatus = (id: string, status: 'pending' | 'paid' | 'overdue') => {
    setBills(bills.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleDeleteBill = (id: string) => {
    setBills(bills.filter(b => b.id !== id));
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Desktop and Mobile Responsive */}
      <div className="max-w-7xl mx-auto bg-white min-h-screen shadow-xl">
        <div className="md:flex md:gap-6 md:p-6">
          {/* Sidebar Navigation - Desktop Only */}
          <div className="hidden md:block md:w-64 md:flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sticky top-6">
              <div className="mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                    {username.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm text-gray-900">{username}</div>
                    <div className="text-xs text-gray-500">Contractor</div>
                  </div>
                </div>
              </div>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'projects'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Projects</span>
                </button>
                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'expenses'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Receipt className="w-5 h-5" />
                  <span>Expenses</span>
                </button>
                <button
                  onClick={() => setActiveTab('bills')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'bills'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>Bills</span>
                </button>
                <button
                  onClick={() => setActiveTab('more')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'more'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                  <span>More</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 md:overflow-y-auto">
            {activeTab === 'dashboard' && (
              <Dashboard
                projects={projects}
                expenses={expenses}
                bills={bills}
                payments={payments}
              />
            )}
            {activeTab === 'projects' && (
              <Projects
                projects={projects}
                onAddProject={handleAddProject}
                onDeleteProject={handleDeleteProject}
                onUpdateProject={handleUpdateProject}
              />
            )}
            {activeTab === 'expenses' && (
              <Expenses
                expenses={expenses}
                projects={projects}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
              />
            )}
            {activeTab === 'bills' && (
              <Bills
                bills={bills}
                projects={projects}
                onAddBill={handleAddBill}
                onUpdateBillStatus={handleUpdateBillStatus}
                onDeleteBill={handleDeleteBill}
              />
            )}
            {activeTab === 'more' && (
              <More username={username} onLogout={handleLogout} />
            )}
          </div>
        </div>

        {/* Bottom Navigation - Mobile Only */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex justify-around items-center h-16 px-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Home className={`w-6 h-6 ${activeTab === 'dashboard' ? 'fill-blue-600' : ''}`} />
              <span className="text-xs mt-1">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                activeTab === 'projects' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Briefcase className={`w-6 h-6 ${activeTab === 'projects' ? 'fill-blue-600' : ''}`} />
              <span className="text-xs mt-1">Projects</span>
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                activeTab === 'expenses' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Receipt className={`w-6 h-6 ${activeTab === 'expenses' ? 'fill-blue-600' : ''}`} />
              <span className="text-xs mt-1">Expenses</span>
            </button>
            <button
              onClick={() => setActiveTab('bills')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                activeTab === 'bills' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <FileText className={`w-6 h-6 ${activeTab === 'bills' ? 'fill-blue-600' : ''}`} />
              <span className="text-xs mt-1">Bills</span>
            </button>
            <button
              onClick={() => setActiveTab('more')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                activeTab === 'more' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Menu className={`w-6 h-6 ${activeTab === 'more' ? 'fill-blue-600' : ''}`} />
              <span className="text-xs mt-1">More</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
