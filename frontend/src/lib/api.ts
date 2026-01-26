const API_URL = 'http://localhost:5000/api';

export const fetcher = async (endpoint: string, options: any = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
};

export const authApi = {
    login: (data: any) => fetcher('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: any) => fetcher('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
};

export const projectApi = {
    list: () => fetcher('/projects'),
    create: (data: any) => fetcher('/projects', { method: 'POST', body: JSON.stringify(data) }),
};

export const taskApi = {
    myTasks: () => fetcher('/tasks/my-tasks'),
    create: (data: any) => fetcher('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => fetcher(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    review: (data: any) => fetcher('/tasks/review', { method: 'POST', body: JSON.stringify(data) }),
    allReviews: () => fetcher('/tasks/reviews'),
};

export const dashboardApi = {
    user: () => fetcher('/dashboard/user'),
    admin: () => fetcher('/dashboard/admin'),
};
