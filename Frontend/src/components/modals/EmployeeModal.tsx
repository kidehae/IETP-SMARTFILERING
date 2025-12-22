import { useState, useEffect } from 'react';
import { X,  } from 'lucide-react';

interface EmployeeModalProps {
  language: 'en' | 'am';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  subcities: Array<{en: string; am: string}>;
  initialData?: any;
  isEditing?: boolean;
}

const translations = {
  en: {
    addEmployee: 'Add Employee',
    editEmployee: 'Edit Employee',
    employeeId: 'Employee ID',
    name: 'Full Name',
    telegramId: 'Telegram Chat ID',
    subcity: 'Assigned Subcity',
    sensor: 'Assigned Sensor',
    phone: 'Phone Number',
    cancel: 'Cancel',
    save: 'Save',
    required: 'This field is required',
    uniqueEmployeeId: 'Employee ID must be unique',
    uniqueTelegramId: 'Telegram Chat ID must be unique',
    exampleId: 'e.g., EMP-001',
    exampleName: 'e.g., John Doe',
    exampleTelegram: 'e.g., 1234567890',
    examplePhone: 'e.g., +251 91 234 5678',
    selectSubcity: 'Select Subcity',
    selectSensor: 'Select Sensor',
  },
  am: {
    addEmployee: 'ሰራተኛ ጨምር',
    editEmployee: 'ሰራተኛ አርትዕ',
    employeeId: 'የሰራተኛ መታወቂያ',
    name: 'ሙሉ ስም',
    telegramId: 'የቴሌግራም ቻት መታወቂያ',
    subcity: 'የተመደበበት ክፍለ ከተማ',
    sensor: 'የተመደበበት ሴንሰር',
    phone: 'ስልክ ቁጥር',
    cancel: 'ሰርዝ',
    save: 'አስቀምጥ',
    required: 'ይህ መስክ ያስፈልጋል',
    uniqueEmployeeId: 'የሰራተኛ መታወቂያ ልዩ መሆን አለበት',
    uniqueTelegramId: 'የቴሌግራም ቻት መታወቂያ ልዩ መሆን አለበት',
    exampleId: 'ለምሳሌ፣ EMP-001',
    exampleName: 'ለምሳሌ፣ ዮሐንስ ዶው',
    exampleTelegram: 'ለምሳሌ፣ 1234567890',
    examplePhone: 'ለምሳሌ፣ +251 91 234 5678',
    selectSubcity: 'ክፍለ ከተማ ይምረጡ',
    selectSensor: 'ሴንሰር ይምረጡ',
  },
};

export function EmployeeModal({
  language,
  isOpen,
  onClose,
  onSubmit,
  subcities,
  initialData,
  isEditing = false,
}: EmployeeModalProps) {
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    telegram_chat_id: '',
    assigned_subcity: '',
    assigned_sensor: 'A',
    phone_number: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const t = translations[language];

  useEffect(() => {
    if (initialData) {
      setFormData({
        employee_id: initialData.employee_id,
        name: initialData.name,
        telegram_chat_id: initialData.telegram_chat_id,
        assigned_subcity: initialData.assigned_subcity,
        assigned_sensor: initialData.assigned_sensor,
        phone_number: initialData.phone_number || '',
      });
    } else {
      setFormData({
        employee_id: '',
        name: '',
        telegram_chat_id: '',
        assigned_subcity: '',
        assigned_sensor: 'A',
        phone_number: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const sensors = ['A', 'B', 'C', 'D', 'E', 'F'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employee_id.trim()) {
      newErrors.employee_id = t.required;
    }

    if (!formData.name.trim()) {
      newErrors.name = t.required;
    }

    if (!formData.telegram_chat_id.trim()) {
      newErrors.telegram_chat_id = t.required;
    }

    if (!formData.assigned_subcity) {
      newErrors.assigned_subcity = t.required;
    }

    if (!formData.assigned_sensor) {
      newErrors.assigned_sensor = t.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? t.editEmployee : t.addEmployee}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.employeeId}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
               
              </div>
              <input
                type="text"
                value={formData.employee_id}
                onChange={(e) => handleChange('employee_id', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.employee_id ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t.exampleId}
                disabled={isEditing}
              />
            </div>
            {errors.employee_id && (
              <p className="mt-1 text-sm text-red-600">{errors.employee_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.name}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t.exampleName}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.telegramId}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                
              </div>
              <input
                type="text"
                value={formData.telegram_chat_id}
                onChange={(e) => handleChange('telegram_chat_id', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.telegram_chat_id ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t.exampleTelegram}
              />
            </div>
            {errors.telegram_chat_id && (
              <p className="mt-1 text-sm text-red-600">{errors.telegram_chat_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.phone}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
               
              </div>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t.examplePhone}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.subcity}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                
              </div>
              <select
                value={formData.assigned_subcity}
                onChange={(e) => handleChange('assigned_subcity', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.assigned_subcity ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{t.selectSubcity}</option>
                {subcities.map((subcity) => (
                  <option key={subcity.en} value={subcity.en}>
                    {language === 'en' ? subcity.en : subcity.am}
                  </option>
                ))}
              </select>
            </div>
            {errors.assigned_subcity && (
              <p className="mt-1 text-sm text-red-600">{errors.assigned_subcity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.sensor}
            </label>
            <select
              value={formData.assigned_sensor}
              onChange={(e) => handleChange('assigned_sensor', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.assigned_sensor ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">{t.selectSensor}</option>
              {sensors.map((sensor) => (
                <option key={sensor} value={sensor}>
                  Sensor {sensor}
                </option>
              ))}
            </select>
            {errors.assigned_sensor && (
              <p className="mt-1 text-sm text-red-600">{errors.assigned_sensor}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}