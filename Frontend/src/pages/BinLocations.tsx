// import { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, MapPin, Search, CheckCircle, XCircle } from 'lucide-react';
// import { getBinLocations, addBinLocation, updateBinLocation, getSubcities } from '../services/api';
// import BinLocationModal from '../components/modals/BinLocationModal';

// interface BinLocation {
//   id: number;
//   sensor_id: string;
//   subcity: string;
//   location_name: string;
//   latitude: number;
//   longitude: number;
//   bin_type: string;
//   address: string;
//   is_active: boolean;
//   created_at: string;
// }

// interface BinLocationsProps {
//   language: 'en' | 'am';
// }

// const translations = {
//   en: {
//     title: 'Bin Locations Management',
//     addLocation: 'Add Bin Location',
//     search: 'Search locations...',
//     sensorId: 'Sensor ID',
//     location: 'Location Name',
//     subcity: 'Subcity',
//     type: 'Bin Type',
//     coordinates: 'Coordinates',
//     status: 'Status',
//     actions: 'Actions',
//     noLocations: 'No bin locations found',
//     confirmDelete: 'Are you sure you want to delete this location?',
//     deleteSuccess: 'Location deleted successfully',
//     addSuccess: 'Location added successfully',
//     updateSuccess: 'Location updated successfully',
//     active: 'Active',
//     inactive: 'Inactive',
//     viewMap: 'View on Map',
//     edit: 'Edit',
//     delete: 'Delete',
//   },
//   am: {
//     title: 'የቆሻሻ መጣሪያ ቦታዎች አስተዳደር',
//     addLocation: 'ቦታ ጨምር',
//     search: 'ቦታዎችን ይፈልጉ...',
//     sensorId: 'የሴንሰር መታወቂያ',
//     location: 'የቦታ ስም',
//     subcity: 'ክፍለ ከተማ',
//     type: 'የቆሻሻ መጣሪያ አይነት',
//     coordinates: 'አቅጣጫዎች',
//     status: 'ሁኔታ',
//     actions: 'ድርጊቶች',
//     noLocations: 'ምንም የቆሻሻ መጣሪያ ቦታ አልተገኘም',
//     confirmDelete: 'ይህን ቦታ መሰረዝ እንደሚፈልጉ እርግጠኛ ነዎት?',
//     deleteSuccess: 'ቦታ በተሳካ ሁኔታ ተሰርዟል',
//     addSuccess: 'ቦታ በተሳካ ሁኔታ ተጨምሯል',
//     updateSuccess: 'ቦታ በተሳካ ሁኔታ ተሻሽሏል',
//     active: 'ንቁ',
//     inactive: 'ንቁ ያልሆነ',
//     viewMap: 'በካርታ ላይ ይመልከቱ',
//     edit: 'አርትዕ',
//     delete: 'ሰርዝ',
//   },
// };

// export   function BinLocations({ language }: BinLocationsProps) {
//   const [locations, setLocations] = useState<BinLocation[]>([]);
//   const [filteredLocations, setFilteredLocations] = useState<BinLocation[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [subcities, setSubcities] = useState<any[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingLocation, setEditingLocation] = useState<BinLocation | null>(null);

//   const t = translations[language];

//   useEffect(() => {
//     fetchLocations();
//     fetchSubcities();
//   }, []);

//   useEffect(() => {
//     filterLocations();
//   }, [searchTerm, locations]);

//   const fetchLocations = async () => {
//     try {
//       const response = await getBinLocations();
//       if (response.success) {
//         setLocations(response.locations);
//         setFilteredLocations(response.locations);
//       }
//     } catch (error) {
//       console.error('Error fetching bin locations:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSubcities = async () => {
//     try {
//       const response = await getSubcities();
//       if (response.success) {
//         setSubcities(response.subcities);
//       }
//     } catch (error) {
//       console.error('Error fetching subcities:', error);
//     }
//   };

//   const filterLocations = () => {
//     if (!searchTerm.trim()) {
//       setFilteredLocations(locations);
//       return;
//     }

//     const filtered = locations.filter(location =>
//       location.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       location.sensor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       location.subcity.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredLocations(filtered);
//   };

//   const handleAddLocation = async (locationData: any) => {
//     try {
//       const response = await addBinLocation(locationData);
//       if (response.success) {
//         alert(t.addSuccess);
//         fetchLocations();
//         setShowModal(false);
//       } else {
//         alert(response.error);
//       }
//     } catch (error) {
//       console.error('Error adding location:', error);
//       alert('Error adding location');
//     }
//   };

//   const handleUpdateLocation = async (id: number, locationData: any) => {
//     try {
//       const response = await updateBinLocation(id, locationData);
//       if (response.success) {
//         alert(t.updateSuccess);
//         fetchLocations();
//         setShowModal(false);
//         setEditingLocation(null);
//       } else {
//         alert(response.error);
//       }
//     } catch (error) {
//       console.error('Error updating location:', error);
//       alert('Error updating location');
//     }
//   };

//   const handleDeleteLocation = async (id: number) => {
//     if (!confirm(t.confirmDelete)) return;

//     try {
//       // Note: We need to implement delete endpoint in backend
//       // For now, let's update the location to inactive
//       const response = await updateBinLocation(id, { is_active: false });
//       if (response.success) {
//         alert(t.deleteSuccess);
//         fetchLocations();
//       } else {
//         alert(response.error);
//       }
//     } catch (error) {
//       console.error('Error deleting location:', error);
//       alert('Error deleting location');
//     }
//   };

//   const handleEditClick = (location: BinLocation) => {
//     setEditingLocation(location);
//     setShowModal(true);
//   };

//   const handleViewMap = (lat: number, lng: number) => {
//     window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
//   };

//   if (loading) {
//     return <div className="text-center py-8">{language === 'en' ? 'Loading...' : 'በመጫን ላይ...'}</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
//         <button
//           onClick={() => setShowModal(true)}
//           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <Plus className="w-4 h-4" />
//           {t.addLocation}
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <div className="p-4 border-b border-gray-200">
//           <div className="relative">
//             <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//               <Search className="w-5 h-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder={t.search}
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {t.sensorId}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {t.location}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {t.subcity}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {t.type}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {t.coordinates}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {t.status}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {t.actions}
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredLocations.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
//                     {t.noLocations}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredLocations.map((location) => (
//                   <tr key={location.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
//                           <MapPin className="w-4 h-4 text-green-600" />
//                         </div>
//                         <span className="font-medium">{location.sensor_id}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-medium text-gray-900">{location.location_name}</div>
//                       <div className="text-sm text-gray-500">{location.address}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {location.subcity}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                         location.bin_type.toLowerCase().includes('solid')
//                           ? 'bg-blue-100 text-blue-800'
//                           : 'bg-purple-100 text-purple-800'
//                       }`}>
//                         {location.bin_type}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <div className="space-y-1">
//                         <div>Lat: {location.latitude}</div>
//                         <div>Lng: {location.longitude}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         {location.is_active ? (
//                           <>
//                             <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
//                             <span className="text-sm text-green-600">{t.active}</span>
//                           </>
//                         ) : (
//                           <>
//                             <XCircle className="w-4 h-4 text-red-500 mr-1" />
//                             <span className="text-sm text-red-600">{t.inactive}</span>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handleViewMap(location.latitude, location.longitude)}
//                           className="text-blue-600 hover:text-blue-900"
//                           title={t.viewMap}
//                         >
//                           <MapPin className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleEditClick(location)}
//                           className="text-blue-600 hover:text-blue-900"
//                           title={t.edit}
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteLocation(location.id)}
//                           className="text-red-600 hover:text-red-900"
//                           title={t.delete}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showModal && (
//         <BinLocationModal
//           language={language}
//           isOpen={showModal}
//           onClose={() => {
//             setShowModal(false);
//             setEditingLocation(null);
//           }}
//           onSubmit={editingLocation ? 
//             (data: any) => handleUpdateLocation(editingLocation.id, data) : 
//             handleAddLocation}
//           subcities={subcities}
//           initialData={editingLocation}
//           isEditing={!!editingLocation}
//         />
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Search, CheckCircle, XCircle } from 'lucide-react';
import { getBinLocations, addBinLocation, updateBinLocation, getSubcities } from '../services/api';
import BinLocationModal from '../components/modals/BinLocationModal';

interface BinLocation {
  id: number;
  sensor_id: string;
  subcity: string;
  location_name: string;
  latitude: number;
  longitude: number;
  bin_type: string;
  address: string;
  is_active: boolean;
  created_at: string;
}

interface BinLocationsProps {
  language: 'en' | 'am';
}

const translations = {
  en: {
    title: 'Bin Locations Management',
    addLocation: 'Add Bin Location',
    search: 'Search locations...',
    sensorId: 'Sensor ID',
    location: 'Location Name',
    subcity: 'Subcity',
    type: 'Bin Type',
    coordinates: 'Coordinates',
    status: 'Status',
    actions: 'Actions',
    noLocations: 'No bin locations found',
    confirmDelete: 'Are you sure you want to delete this location?',
    deleteSuccess: 'Location deleted successfully',
    addSuccess: 'Location added successfully',
    updateSuccess: 'Location updated successfully',
    active: 'Active',
    inactive: 'Inactive',
    viewMap: 'View on Map',
    edit: 'Edit',
    delete: 'Delete',
  },
  am: {
    title: 'የቆሻሻ መጣሪያ ቦታዎች አስተዳደር',
    addLocation: 'ቦታ ጨምር',
    search: 'ቦታዎችን ይፈልጉ...',
    sensorId: 'የሴንሰር መታወቂያ',
    location: 'የቦታ ስም',
    subcity: 'ክፍለ ከተማ',
    type: 'የቆሻሻ መጣሪያ አይነት',
    coordinates: 'አቅጣጫዎች',
    status: 'ሁኔታ',
    actions: 'ድርጊቶች',
    noLocations: 'ምንም የቆሻሻ መጣሪያ ቦታ አልተገኘም',
    confirmDelete: 'ይህን ቦታ መሰረዝ እንደሚፈልጉ እርግጠኛ ነዎት?',
    deleteSuccess: 'ቦታ በተሳካ ሁኔታ ተሰርዟል',
    addSuccess: 'ቦታ በተሳካ ሁኔታ ተጨምሯል',
    updateSuccess: 'ቦታ በተሳካ ሁኔታ ተሻሽሏል',
    active: 'ንቁ',
    inactive: 'ንቁ ያልሆነ',
    viewMap: 'በካርታ ላይ ይመልከቱ',
    edit: 'አርትዕ',
    delete: 'ሰርዝ',
  },
};

export function BinLocations({ language }: BinLocationsProps) {
  const [locations, setLocations] = useState<BinLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<BinLocation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [subcities, setSubcities] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<BinLocation | null>(null);

  const t = translations[language];

  useEffect(() => {
    fetchLocations();
    fetchSubcities();
  }, []);

  useEffect(() => {
    filterLocations();
  }, [searchTerm, locations]);

  const fetchLocations = async () => {
    try {
      const response = await getBinLocations();
      if (response.success) {
        setLocations(response.locations);
        setFilteredLocations(response.locations);
      }
    } catch (error) {
      console.error('Error fetching bin locations:', error);
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

  const filterLocations = () => {
    if (!searchTerm.trim()) {
      setFilteredLocations(locations);
      return;
    }

    const filtered = locations.filter(location =>
      location.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.sensor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.subcity.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  const handleAddLocation = async (locationData: any) => {
    try {
      const response = await addBinLocation(locationData);
      if (response.success) {
        alert(t.addSuccess);
        fetchLocations();
        setShowModal(false);
      } else {
        alert(response.error);
      }
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Error adding location');
    }
  };

  const handleUpdateLocation = async (id: number, locationData: any) => {
    try {
      const response = await updateBinLocation(id, locationData);
      if (response.success) {
        alert(t.updateSuccess);
        fetchLocations();
        setShowModal(false);
        setEditingLocation(null);
      } else {
        alert(response.error);
      }
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Error updating location');
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!confirm(t.confirmDelete)) return;

    try {
      // Note: We need to implement delete endpoint in backend
      // For now, let's update the location to inactive
      const response = await updateBinLocation(id, { is_active: false });
      if (response.success) {
        alert(t.deleteSuccess);
        fetchLocations();
      } else {
        alert(response.error);
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Error deleting location');
    }
  };

  const handleEditClick = (location: BinLocation) => {
    setEditingLocation(location);
    setShowModal(true);
  };

  const handleViewMap = (lat: number, lng: number) => {
    window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
  };

  if (loading) {
    return <div className="loading-container">{language === 'en' ? 'Loading...' : 'በመጫን ላይ...'}</div>;
  }

  return (
    <div className="locations-container">
      <div className="locations-header">
        <h1 className="locations-title">{t.title}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="add-location-btn"
        >
          <Plus className="btn-icon" />
          {t.addLocation}
        </button>
      </div>

      <div className="locations-card">
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
          <table className="locations-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">{t.sensorId}</th>
                <th className="table-header-cell">{t.location}</th>
                <th className="table-header-cell">{t.subcity}</th>
                <th className="table-header-cell">{t.type}</th>
                <th className="table-header-cell">{t.coordinates}</th>
                <th className="table-header-cell">{t.status}</th>
                <th className="table-header-cell">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-data-cell">
                    {t.noLocations}
                  </td>
                </tr>
              ) : (
                filteredLocations.map((location) => (
                  <tr key={location.id} className="table-row">
                    <td className="table-cell">
                      <div className="sensor-id-cell">
                        <div className="location-avatar-icon">
                          <MapPin className="location-avatar-icon-inner" />
                        </div>
                        <span className="sensor-id">{location.sensor_id}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="location-info">
                        <div className="location-name">{location.location_name}</div>
                        <div className="location-address">{location.address}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="subcity-text">{location.subcity}</span>
                    </td>
                    <td className="table-cell">
                      <span className={`bin-type-badge ${location.bin_type.toLowerCase().includes('solid') ? 'bin-type-solid' : 'bin-type-other'}`}>
                        {location.bin_type}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="coordinates-cell">
                        <div>Lat: {location.latitude}</div>
                        <div>Lng: {location.longitude}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="status-cell">
                        {location.is_active ? (
                          <>
                            <CheckCircle className="status-icon-active" />
                            <span className="status-text-active">{t.active}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="status-icon-inactive" />
                            <span className="status-text-inactive">{t.inactive}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="actions-cell">
                        <button
                          onClick={() => handleViewMap(location.latitude, location.longitude)}
                          className="map-btn"
                          title={t.viewMap}
                        >
                          <MapPin className="action-icon" />
                        </button>
                        <button
                          onClick={() => handleEditClick(location)}
                          className="edit-btn"
                          title={t.edit}
                        >
                          <Edit className="action-icon" />
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(location.id)}
                          className="delete-btn"
                          title={t.delete}
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
        <BinLocationModal
          language={language}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingLocation(null);
          }}
          onSubmit={editingLocation ? 
            (data: any) => handleUpdateLocation(editingLocation.id, data) : 
            handleAddLocation}
          subcities={subcities}
          initialData={editingLocation}
          isEditing={!!editingLocation}
        />
      )}
    </div>
  );
}