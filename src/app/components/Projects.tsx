import { useState } from 'react';
import { Plus, Search, MapPin, Calendar, DollarSign, Users, MoreVertical, Edit, Trash2, Eye, Briefcase } from 'lucide-react';

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

interface ProjectsProps {
  projects: Project[];
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onDeleteProject: (id: string) => void;
  onUpdateProject: (id: string, project: Partial<Project>) => void;
}

export function Projects({ projects, onAddProject, onDeleteProject, onUpdateProject }: ProjectsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProject = {
      name: formData.get('name') as string,
      client: formData.get('client') as string,
      location: formData.get('location') as string,
      status: formData.get('status') as 'active' | 'completed' | 'on-hold',
      budget: parseFloat(formData.get('budget') as string),
      spent: 0,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      progress: 0
    };
    onAddProject(newProject);
    setShowAddModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'on-hold': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl md:rounded-3xl shadow-lg">
        <h1 className="text-2xl mb-1">Projects</h1>
        <p className="text-blue-100 text-sm">{projects.length} total projects</p>
      </div>

      {/* Search and Filter */}
      <div className="px-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'active', 'completed', 'on-hold'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="px-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center">
            <div className="text-gray-400 mb-4">
              <Briefcase className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">No Projects Found</h3>
            <p className="text-gray-500 mb-4">Start by adding your first project</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Project
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg text-gray-900 mb-1">{project.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{project.client}</span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(showMenu === project.id ? null : project.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                  {showMenu === project.id && (
                    <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-32 z-10">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setShowMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          onDeleteProject(project.id);
                          setShowMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{project.location}</span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                <div className="text-sm text-gray-600">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {project.startDate}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget</span>
                  <span className="text-gray-900">₹{project.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent</span>
                  <span className="text-gray-900">₹{project.spent.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min((project.spent / project.budget) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {((project.spent / project.budget) * 100).toFixed(0)}% of budget used
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed right-6 bottom-24 md:bottom-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-10"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl mb-4 text-gray-900">Add New Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Highway Construction"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  name="client"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ABC Corporation"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mumbai, Maharashtra"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Budget</label>
                <input
                  type="number"
                  name="budget"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="500000"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl text-gray-900">{selectedProject.name}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Client</span>
                <p className="text-gray-900">{selectedProject.client}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Location</span>
                <p className="text-gray-900">{selectedProject.location}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status</span>
                <p className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${getStatusColor(selectedProject.status)}`}>
                  {selectedProject.status}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Budget</span>
                  <p className="text-gray-900">₹{selectedProject.budget.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Spent</span>
                  <p className="text-gray-900">₹{selectedProject.spent.toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Start Date</span>
                  <p className="text-gray-900">{selectedProject.startDate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">End Date</span>
                  <p className="text-gray-900">{selectedProject.endDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}