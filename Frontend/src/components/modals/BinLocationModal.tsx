import { useState, useEffect } from 'react';
import { X} from 'lucide-react';

interface BinLocationModalProps {
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
    addLocation: 'Add Bin Location',
    editLocation: 'Edit Bin Location',
    sensorId: 'Sensor ID',
    locationName: 'Location Name',
    subcity: 'Subcity',
    latitude: 'Latitude',
    longitude: 'Longitude',
    binType: 'Bin Type',
    address: 'Address',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    cancel: 'Cancel',
    save: 'Save',
    required: 'This field is required',
    validNumber: 'Please enter a valid number',
    exampleSensorId: 'e.g., A, B, C, etc.',
    exampleLocation: 'e.g., Main Road, Near Hospital',
    exampleAddress: 'e.g., Bole Road, Near Atlas Hotel',
    exampleLatitude: 'e.g., 8.9958',
    exampleLongitude: 'e.g., 38.7856',
    selectSubcity: 'Select Subcity',
    selectBinType: 'Select Bin Type',
    solidWaste: 'Solid Waste',
    liquidWaste: 'Liquid Waste',
    recyclable: 'Recyclable',
    medical: 'Medical Waste',
  },
  am: {
    addLocation: 'የቆሻሻ መጣሪያ ቦታ ጨምር',
    editLocation: 'የቆሻሻ መጣሪያ ቦታ አርትዕ',
    sensorId: 'የሴንሰር መታወቂያ',
    locationName: 'የቦታ ስም',
    subcity: 'ክፍለ ከተማ',
    latitude: 'ላቲቲዩድ',
    longitude: 'ሎንጂቲዩድ',
    binType: 'የቆሻሻ መጣሪያ አይነት',
    address: 'አድራሻ',
    status: 'ሁኔታ',
    active: 'ንቁ',
    inactive: 'ንቁ ያልሆነ',
    cancel: 'ሰርዝ',
    save: 'አስቀምጥ',
    required: 'ይህ መስክ ያስፈልጋል',
    validNumber: 'እባክዎ ትክክለኛ ቁጥር ያስገቡ',
    exampleSensorId: 'ለምሳሌ፣ A, B, C, ወዘተ.',
    exampleLocation: 'ለምሳሌ፣ ዋና መንገድ፣ ከሆስፒታል አጠገብ',
    exampleAddress: 'ለምሳሌ፣ ቦሌ መንገድ፣ ከአትላስ ሆቴል አጠገብ',
    exampleLatitude: 'ለምሳሌ፣ 8.9958',
    exampleLongitude: 'ለምሳሌ፣ 38.7856',
    selectSubcity: 'ክፍለ ከተማ ይምረጡ',
    selectBinType: 'የቆሻሻ መጣሪያ አይነት ይምረጡ',
    solidWaste: 'ጠንካራ ቆሻሻ',
    liquidWaste: 'ፈሳሽ ቆሻሻ',
    recyclable: 'እንደገና የሚጠቀም',
    medical: 'የሕክምና ቆሻሻ',
  },
};

const binTypes = [
  { value: 'Solid Waste', label: { en: 'Solid Waste', am: 'ጠንካራ ቆሻሻ' } },
  { value: 'Liquid Waste', label: { en: 'Liquid Waste', am: 'ፈሳሽ ቆሻሻ' } },
  { value: 'Recyclable', label: { en: 'Recyclable', am: 'እንደገና የሚጠቀም' } },
  { value: 'Medical Waste', label: { en: 'Medical Waste', am: 'የሕክምና ቆሻሻ' } },
];

 function BinLocationModal({
  language,
  isOpen,
  onClose,
  onSubmit,
  subcities,
  initialData,
  isEditing = false,
}: BinLocationModalProps) {
  const [formData, setFormData] = useState({
    sensor_id: '',
    subcity: '',
    location_name: '',
    latitude: '',
    longitude: '',
    bin_type: 'Solid Waste',
    address: '',
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const t = translations[language];

  useEffect(() => {
    if (initialData) {
      setFormData({
        sensor_id: initialData.sensor_id,
        subcity: initialData.subcity,
        location_name: initialData.location_name,
        latitude: initialData.latitude.toString(),
        longitude: initialData.longitude.toString(),
        bin_type: initialData.bin_type,
        address: initialData.address || '',
        is_active: initialData.is_active,
      });
    } else {
      setFormData({
        sensor_id: '',
        subcity: '',
        location_name: '',
        latitude: '',
        longitude: '',
        bin_type: 'Solid Waste',
        address: '',
        is_active: true,
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.sensor_id.trim()) {
      newErrors.sensor_id = t.required;
    }

    if (!formData.location_name.trim()) {
      newErrors.location_name = t.required;
    }

    if (!formData.subcity) {
      newErrors.subcity = t.required;
    }

    if (!formData.latitude) {
      newErrors.latitude = t.required;
    } else if (isNaN(parseFloat(formData.latitude))) {
      newErrors.latitude = t.validNumber;
    }

    if (!formData.longitude) {
      newErrors.longitude = t.required;
    } else if (isNaN(parseFloat(formData.longitude))) {
      newErrors.longitude = t.validNumber;
    }

    if (!formData.bin_type) {
      newErrors.bin_type = t.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };
      onSubmit(dataToSubmit);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
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
              {isEditing ? t.editLocation : t.addLocation}
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
              {t.sensorId}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                
              </div>
              <input
                type="text"
                value={formData.sensor_id}
                onChange={(e) => handleChange('sensor_id', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.sensor_id ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t.exampleSensorId}
                disabled={isEditing}
              />
            </div>
            {errors.sensor_id && (
              <p className="mt-1 text-sm text-red-600">{errors.sensor_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.locationName}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                
              </div>
              <input
                type="text"
                value={formData.location_name}
                onChange={(e) => handleChange('location_name', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.location_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t.exampleLocation}
              />
            </div>
            {errors.location_name && (
              <p className="mt-1 text-sm text-red-600">{errors.location_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.address}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
               
              </div>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t.exampleAddress}
                rows={2}
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
                value={formData.subcity}
                onChange={(e) => handleChange('subcity', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.subcity ? 'border-red-500' : 'border-gray-300'
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
            {errors.subcity && (
              <p className="mt-1 text-sm text-red-600">{errors.subcity}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.latitude}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                 
                </div>
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.latitude ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t.exampleLatitude}
                />
              </div>
              {errors.latitude && (
                <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.longitude}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                 
                </div>
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.longitude ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t.exampleLongitude}
                />
              </div>
              {errors.longitude && (
                <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.binType}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                
              </div>
              <select
                value={formData.bin_type}
                onChange={(e) => handleChange('bin_type', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bin_type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{t.selectBinType}</option>
                {binTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {language === 'en' ? type.label.en : type.label.am}
                  </option>
                ))}
              </select>
            </div>
            {errors.bin_type && (
              <p className="mt-1 text-sm text-red-600">{errors.bin_type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.status}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={formData.is_active === true}
                  onChange={() => handleChange('is_active', true)}
                  className="mr-2"
                />
                <span className="text-sm">{t.active}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={formData.is_active === false}
                  onChange={() => handleChange('is_active', false)}
                  className="mr-2"
                />
                <span className="text-sm">{t.inactive}</span>
              </label>
            </div>
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

export default BinLocationModal;