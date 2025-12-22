const API_BASE_URL = 'http://localhost:3001/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const getDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const getEmployees = async () => {
  const response = await fetch(`${API_BASE_URL}/employees`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const addEmployee = async (employeeData: any) => {
  const response = await fetch(`${API_BASE_URL}/employees`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(employeeData),
  });
  return response.json();
};

export const updateEmployee = async (id: number, employeeData: any) => {
  const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(employeeData),
  });
  return response.json();
};

export const deleteEmployee = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
};

export const getBinLocations = async () => {
  const response = await fetch(`${API_BASE_URL}/bin-locations`);
  return response.json();
};

export const addBinLocation = async (locationData: any) => {
  const response = await fetch(`${API_BASE_URL}/bin-locations`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(locationData),
  });
  return response.json();
};


export const updateBinLocation = async (id: number, locationData: any) => {
  const response = await fetch(`${API_BASE_URL}/bin-locations/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(locationData),
  });
  return response.json();
};

export const getCleaningHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/cleaning-history`);
  return response.json();
};

export const recordCleaning = async (cleaningData: any) => {
  const response = await fetch(`${API_BASE_URL}/cleaning-records`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(cleaningData),
  });
  return response.json();
};

export const getSubcities = async () => {
  const response = await fetch(`${API_BASE_URL}/subcities`);
  return response.json();
};
