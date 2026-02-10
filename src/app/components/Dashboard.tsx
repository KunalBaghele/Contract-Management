import { DollarSign, TrendingUp, AlertCircle, CheckCircle, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  projects: any[];
  expenses: any[];
  bills: any[];
  payments: any[];
}

export function Dashboard({ projects, expenses, bills, payments }: DashboardProps) {
  // Calculate metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalReceived = payments.filter(p => p.status === 'received').reduce((sum, p) => sum + p.amount, 0);
  const pendingBills = bills.filter(b => b.status === 'pending').length;

  // Chart data - expenses by project
  const expensesByProject = projects.map(project => ({
    name: project.name.length > 10 ? project.name.substring(0, 10) + '...' : project.name,
    expenses: expenses.filter(e => e.projectId === project.id).reduce((sum, e) => sum + e.amount, 0)
  })).slice(0, 5);

  // Pie chart data - payment status
  const paymentStatusData = [
    { name: 'Received', value: totalReceived, color: '#10b981' },
    { name: 'Pending', value: totalPending, color: '#f59e0b' }
  ].filter(item => item.value > 0);

  // Project status data
  const projectsByStatus = [
    { name: 'Active', value: projects.filter(p => p.status === 'active').length, color: '#3b82f6' },
    { name: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: '#10b981' },
    { name: 'On Hold', value: projects.filter(p => p.status === 'on-hold').length, color: '#f59e0b' }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl md:rounded-3xl shadow-lg">
        <h1 className="text-2xl mb-1">Dashboard</h1>
        <p className="text-blue-100 text-sm">Overview of your contracts</p>
      </div>

      {projects.length === 0 && expenses.length === 0 && bills.length === 0 ? (
        <div className="px-4">
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl text-gray-900 mb-2">No Data Yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first project, expense, or bill</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Project
              </button>
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Add Expense
              </button>
              <button className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
                Add Bill
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="px-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl text-gray-900">{totalProjects}</div>
              <div className="text-xs text-gray-500">Total Projects</div>
              <div className="text-xs text-blue-600 mt-1">{activeProjects} active</div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-red-100 p-2 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="text-2xl text-gray-900">₹{(totalExpenses / 1000).toFixed(0)}k</div>
              <div className="text-xs text-gray-500">Total Expenses</div>
              <div className="text-xs text-gray-600 mt-1">{expenses.length} entries</div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-amber-100 p-2 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div className="text-2xl text-gray-900">₹{(totalPending / 1000).toFixed(0)}k</div>
              <div className="text-xs text-gray-500">Pending Amount</div>
              <div className="text-xs text-amber-600 mt-1">{pendingBills} pending bills</div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-green-100 p-2 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-2xl text-gray-900">₹{(totalReceived / 1000).toFixed(0)}k</div>
              <div className="text-xs text-gray-500">Received Amount</div>
              <div className="text-xs text-green-600 mt-1">This month</div>
            </div>
          </div>

          {/* Expenses by Project Chart */}
          {expensesByProject.length > 0 && (
            <div className="px-4">
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                <h2 className="text-lg mb-4 text-gray-900">Expenses by Project</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={expensesByProject}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip 
                      formatter={(value: any) => `₹${value.toLocaleString()}`}
                      contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
                    />
                    <Bar dataKey="expenses" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Payment Status & Project Status */}
          <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {paymentStatusData.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                <h3 className="text-sm mb-3 text-gray-900">Payment Status</h3>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={45}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-3 mt-2">
                  {paymentStatusData.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projectsByStatus.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                <h3 className="text-sm mb-3 text-gray-900">Project Status</h3>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={projectsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={45}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-2 mt-2 flex-wrap">
                  {projectsByStatus.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          {bills.length > 0 && (
            <div className="px-4">
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                <h2 className="text-lg mb-4 text-gray-900">Recent Activity</h2>
                <div className="space-y-3">
                  {bills.slice(0, 3).map((bill, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${bill.status === 'paid' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                        <div>
                          <div className="text-sm text-gray-900">{bill.vendor}</div>
                          <div className="text-xs text-gray-500">{bill.date}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-900">₹{bill.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}