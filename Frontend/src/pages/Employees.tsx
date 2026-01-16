import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, Phone, MapPin, Search } from 'lucide-react';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee, getSubcities } from '../services/api';
import { EmployeeModal } from '../components/modals/EmployeeModal';
import './pages.css';

interface Employee {
  id: number;
  employee_id: string;
  name: string;
  telegram_chat_id: string;
  assigned_subcity: string;
  assigned_sensor: string;
  phone_number: string;
  created_at: string;
}

interface EmployeesProps {
  language: 'en' | 'am';
}

const translations = {
  en: {
    title: 'Employees Management',
    addEmployee: 'Add Employee',
    search: 'Search employees...',
    employeeId: 'Employee ID',
    name: 'Name',
    telegramId: 'Telegram ID',
    subcity: 'Assigned Subcity',
    sensor: 'Assigned Sensor',
    phone: 'Phone Number',
    actions: 'Actions',
    noEmployees: 'No employees found',
    confirmDelete: 'Are you sure you want to delete this employee?',
    deleteSuccess: 'Employee deleted successfully',
    addSuccess: 'Employee added successfully',
    updateSuccess: 'Employee updated successfully',
  },
  am: {
    title: 'የሰራተኞች አስተዳደር',
    addEmployee: 'ሰራተኛ ጨምር',
    search: 'ሰራተኞችን ይፈልጉ...',
    employeeId: 'የሰራተኛ መታወቂያ',
    name: 'ስም',
    telegramId: 'የቴሌግራም መታወቂያ',
    subcity: 'የተመደበበት ክፍለ ከተማ',
    sensor: 'የተመደበበት ሴንሰር',
    phone: 'ስልክ ቁጥር',
    actions: 'ድርጊቶች',
    noEmployees: 'ምንም ሰራተኛ አልተገኘም',
    confirmDelete: 'ይህን ሰራተኛ መሰረዝ እንደሚፈልጉ እርግጠኛ ነዎት?',
    deleteSuccess: 'ሰራተኛ በተሳካ ሁኔታ ተሰርዟል',
    addSuccess: 'ሰራተኛ በተሳካ ሁኔታ ተጨምሯል',
    updateSuccess: 'ሰራተኛ በተሳካ ሁኔታ ተሻሽሏል',
  },
};

export function Employees({ language }: EmployeesProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [subcities, setSubcities] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const t = translations[language];

  useEffect(() => {
    fetchEmployees();
    fetchSubcities();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      if (response.success) {
        setEmployees(response.employees);
        setFilteredEmployees(response.employees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcities = async () => {
    try {
      const response = await getSubcities();
      if (response.success) {
        setSubcities(response.subcities);
      }
    } catch (error) {
      console.error('Error fetching subcities:', error);
    }
  };

  const filterEmployees = () => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.assigned_subcity.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = async (employeeData: any) => {
    try {
      const response = await addEmployee(employeeData);
      if (response.success) {
        alert(t.addSuccess);
        fetchEmployees();
        setShowModal(false);
      } else {
        alert(response.error);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee');
    }
  };

  const handleUpdateEmployee = async (id: number, employeeData: any) => {
    try {
      const response = await updateEmployee(id, employeeData);
      if (response.success) {
        alert(t.updateSuccess);
        fetchEmployees();
        setShowModal(false);
        setEditingEmployee(null);
      } else {
        alert(response.error);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee');
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm(t.confirmDelete)) return;

    try {
      const response = await deleteEmployee(id);
      if (response.success) {
        alert(t.deleteSuccess);
        fetchEmployees();
      } else {
        alert(response.error);
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee');
    }
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="employees-container">
      <div className="employees-header">
        <h1 className="employees-title">{t.title}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="add-employee-btn"
        >
          <Plus className="btn-icon" />
          {t.addEmployee}
        </button>
      </div>

      <div className="employees-card">
        <div className="search-container">
          <div className="search-wrapper">
            <div className="search-icon">
              <Search className="icon" />
            </div>
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="table-container">
          <table className="employees-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">{t.employeeId}</th>
                <th className="table-header-cell">{t.name}</th>
                <th className="table-header-cell">{t.telegramId}</th>
                <th className="table-header-cell">{t.subcity}</th>
                <th className="table-header-cell">{t.sensor}</th>
                <th className="table-header-cell">{t.phone}</th>
                <th className="table-header-cell">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-data-cell">
                    {t.noEmployees}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="table-row">
                    <td className="table-cell">
                      <div className="employee-id-cell">
                        <div className="avatar-icon">
                          <User className="avatar-icon-inner" />
                        </div>
                        <span className="employee-id">{employee.employee_id}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="employee-name">{employee.name}</div>
                    </td>
                    <td className="table-cell">
                      {employee.telegram_chat_id}
                    </td>
                    <td className="table-cell">
                      <div className="subcity-cell">
                        <MapPin className="subcity-icon" />
                        <span>{employee.assigned_subcity}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="sensor-badge">
                        {employee.assigned_sensor}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="phone-cell">
                        <Phone className="phone-icon" />
                        {employee.phone_number || 'N/A'}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="actions-cell">
                        <button
                          onClick={() => handleEditClick(employee)}
                          className="edit-btn"
                        >
                          <Edit className="action-icon" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="delete-btn"
                        >
                          <Trash2 className="action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <EmployeeModal
          language={language}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingEmployee(null);
          }}
          onSubmit={editingEmployee ? 
            (data) => handleUpdateEmployee(editingEmployee.id, data) : 
            handleAddEmployee}
          subcities={subcities}
          initialData={editingEmployee}
          isEditing={!!editingEmployee}
        />
      )}
    </div>
  );
}