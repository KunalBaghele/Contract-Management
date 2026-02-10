import { useState } from 'react';
import { Plus, Search, Filter, Calendar, Tag, Receipt } from 'lucide-react';

interface Expense {
  id: string;
  projectId: string;
  projectName: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
  receipt?: string;
}

interface ExpensesProps {
  expenses: Expense[];
  projects: any[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'projectName'>) => void;
  onDeleteExpense: (id: string) => void;
}

export function Expenses({ expenses, projects, onAddExpense, onDeleteExpense }: ExpensesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const categories = ['Labor', 'Materials', 'Equipment', 'Transport', 'Utilities', 'Other'];

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === 'all' || expense.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newExpense = {
      projectId: formData.get('projectId') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string),
      date: formData.get('date') as string,
      paymentMethod: formData.get('paymentMethod') as string
    };
    onAddExpense(newExpense);
    setShowAddModal(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Labor': 'bg-purple-100 text-purple-700',
      'Materials': 'bg-blue-100 text-blue-700',
      'Equipment': 'bg-orange-100 text-orange-700',
      'Transport': 'bg-green-100 text-green-700',
      'Utilities': 'bg-yellow-100 text-yellow-700',
      'Other': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-b-3xl md:rounded-3xl shadow-lg">
        <h1 className="text-2xl mb-1">Expenses</h1>
        <p className="text-purple-100 text-sm">{expenses.length} total expenses</p>
        <div className="mt-4 bg-white bg-opacity-20 rounded-2xl p-4">
          <div className="text-sm text-purple-100">Total Expenses</div>
          <div className="text-3xl">₹{totalExpenses.toLocaleString()}</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              filterCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                filterCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses List */}
      <div className="px-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredExpenses.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center">
            <div className="text-gray-400 mb-4">
              <Receipt className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">No Expenses Found</h3>
            <p className="text-gray-500 mb-4">Start by adding your first expense</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add Expense
            </button>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              onClick={() => setSelectedExpense(expense)}
              className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 active:bg-gray-50"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg text-gray-900 mb-1">{expense.description}</h3>
                  <div className="text-sm text-gray-500">{expense.projectName}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg text-gray-900">₹{expense.amount.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs ${getCategoryColor(expense.category)}`}>
                  {expense.category}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{expense.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>{expense.paymentMethod}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed right-6 bottom-24 md:bottom-8 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-10"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl mb-4 text-gray-900">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Project</label>
                <select
                  name="projectId"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Steel rods purchase"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="15000"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Payment Method</label>
                <select
                  name="paymentMethod"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Details Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl text-gray-900">Expense Details</h2>
              <button
                onClick={() => setSelectedExpense(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Description</span>
                <p className="text-gray-900">{selectedExpense.description}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Project</span>
                <p className="text-gray-900">{selectedExpense.projectName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Amount</span>
                <p className="text-2xl text-gray-900">₹{selectedExpense.amount.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Category</span>
                <p className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${getCategoryColor(selectedExpense.category)}`}>
                  {selectedExpense.category}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Date</span>
                  <p className="text-gray-900">{selectedExpense.date}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <p className="text-gray-900">{selectedExpense.paymentMethod}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onDeleteExpense(selectedExpense.id);
                  setSelectedExpense(null);
                }}
                className="w-full px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Delete Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}