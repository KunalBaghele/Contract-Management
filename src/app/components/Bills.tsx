import { useState } from 'react';
import { Plus, Search, FileText, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';

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

interface BillsProps {
  bills: Bill[];
  projects: any[];
  onAddBill: (bill: Omit<Bill, 'id' | 'projectName' | 'status'>) => void;
  onUpdateBillStatus: (id: string, status: 'pending' | 'paid' | 'overdue') => void;
  onDeleteBill: (id: string) => void;
}

export function Bills({ bills, projects, onAddBill, onUpdateBillStatus, onDeleteBill }: BillsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bill.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || bill.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newBill = {
      projectId: formData.get('projectId') as string,
      vendor: formData.get('vendor') as string,
      billNumber: formData.get('billNumber') as string,
      amount: parseFloat(formData.get('amount') as string),
      date: formData.get('date') as string,
      dueDate: formData.get('dueDate') as string,
      description: formData.get('description') as string
    };
    onAddBill(newBill);
    setShowAddModal(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const totalPending = bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0);
  const totalOverdue = bills.filter(b => b.status === 'overdue').reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white p-6 rounded-b-3xl md:rounded-3xl shadow-lg">
        <h1 className="text-2xl mb-1">Bills</h1>
        <p className="text-amber-100 text-sm">{bills.length} total bills</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-white bg-opacity-20 rounded-xl p-3">
            <div className="text-xs text-amber-100">Pending</div>
            <div className="text-lg">₹{(totalPending / 1000).toFixed(0)}k</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-3">
            <div className="text-xs text-amber-100">Overdue</div>
            <div className="text-lg">₹{(totalOverdue / 1000).toFixed(0)}k</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-3">
            <div className="text-xs text-amber-100">Paid</div>
            <div className="text-lg">₹{(totalPaid / 1000).toFixed(0)}k</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search bills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'pending', 'overdue', 'paid'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bills List */}
      <div className="px-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredBills.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">No Bills Found</h3>
            <p className="text-gray-500 mb-4">Start by adding your first bill</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Add Bill
            </button>
          </div>
        ) : (
          filteredBills.map((bill) => (
            <div
              key={bill.id}
              onClick={() => setSelectedBill(bill)}
              className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 active:bg-gray-50"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(bill.status)}
                    <h3 className="text-lg text-gray-900">{bill.vendor}</h3>
                  </div>
                  <div className="text-sm text-gray-500">{bill.projectName}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg text-gray-900">₹{bill.amount.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(bill.status)}`}>
                  {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <FileText className="w-3 h-3" />
                  <span>{bill.billNumber}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Issued: {bill.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={bill.status === 'overdue' ? 'text-red-600' : ''}>
                    Due: {bill.dueDate}
                  </span>
                </div>
              </div>

              {bill.description && (
                <div className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                  {bill.description}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed right-6 bottom-24 md:bottom-8 bg-amber-600 text-white p-4 rounded-full shadow-lg hover:bg-amber-700 transition-colors z-10"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Bill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl mb-4 text-gray-900">Add New Bill</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Project</label>
                <select
                  name="projectId"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                <label className="block text-sm text-gray-700 mb-1">Vendor/Supplier</label>
                <input
                  type="text"
                  name="vendor"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="ABC Steel Suppliers"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Bill Number</label>
                <input
                  type="text"
                  name="billNumber"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="INV-2024-001"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="25000"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Bill Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Additional notes about this bill"
                ></textarea>
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
                  className="flex-1 px-6 py-3 rounded-xl bg-amber-600 text-white hover:bg-amber-700"
                >
                  Add Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bill Details Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl text-gray-900">Bill Details</h2>
              <button
                onClick={() => setSelectedBill(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Vendor</span>
                <p className="text-gray-900">{selectedBill.vendor}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Bill Number</span>
                <p className="text-gray-900">{selectedBill.billNumber}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Project</span>
                <p className="text-gray-900">{selectedBill.projectName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Amount</span>
                <p className="text-2xl text-gray-900">₹{selectedBill.amount.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status</span>
                <div className="mt-1">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(selectedBill.status)}`}>
                    {getStatusIcon(selectedBill.status)}
                    {selectedBill.status.charAt(0).toUpperCase() + selectedBill.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Bill Date</span>
                  <p className="text-gray-900">{selectedBill.date}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Due Date</span>
                  <p className="text-gray-900">{selectedBill.dueDate}</p>
                </div>
              </div>
              {selectedBill.description && (
                <div>
                  <span className="text-sm text-gray-600">Description</span>
                  <p className="text-gray-900 bg-gray-50 rounded-lg p-3 mt-1">{selectedBill.description}</p>
                </div>
              )}
              {selectedBill.status !== 'paid' && (
                <button
                  onClick={() => {
                    onUpdateBillStatus(selectedBill.id, 'paid');
                    setSelectedBill(null);
                  }}
                  className="w-full px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700"
                >
                  Mark as Paid
                </button>
              )}
              <button
                onClick={() => {
                  onDeleteBill(selectedBill.id);
                  setSelectedBill(null);
                }}
                className="w-full px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Delete Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}