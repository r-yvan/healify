const BASE_URL = "http://localhost:8080";

interface AuthResponse {
  token: string;
}

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  location: string;
}

interface Appointment {
  id: number;
  doctorName: string;
  patientName: string;
  appointmentTime: string;
  location: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    // Skip token check for authentication endpoints
    const isAuthEndpoint = endpoint.startsWith("/auth/");

    if (!token && !isAuthEndpoint) {
      console.error("No token found in localStorage");
      throw new Error("Authentication token not found");
    }

    const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token.trim()}` } : {}),
    };

    console.log("Request headers:", defaultHeaders);
    console.log("Making request to:", `${BASE_URL}${endpoint}`);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
      credentials: "include",
      mode: "cors",
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error response data:", errorData);

      if (response.status === 403) {
        console.error(
          "Authentication failed. Token may be invalid or expired."
        );
        // // Clear invalid token
        // localStorage.removeItem("token");
        // localStorage.removeItem("user");
      }

      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    if (response.status === 204) {
      return null as T;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Unable to connect to the server. Please check if the server is running and CORS is properly configured."
      );
    }
    throw error;
  }
};

export const authAPI = {
  login: (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: "PATIENT" | "DOCTOR";
    specialization?: string;
    location?: string;
  }): Promise<AuthResponse> =>
    apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
};

export const patientAPI = {
  getDoctors: (
    specialization?: string,
    location?: string
  ): Promise<Doctor[]> => {
    const params = new URLSearchParams();
    if (specialization && specialization !== "all")
      params.append("specialization", specialization);
    if (location) params.append("location", location);

    return apiRequest<Doctor[]>(`/api/patient/doctors?${params.toString()}`);
  },

  bookAppointment: (
    patientEmail: string,
    appointmentData: {
      doctorId: number;
      appointmentTime: string;
      location: string;
    }
  ): Promise<Appointment> =>
    apiRequest<Appointment>(
      `/api/patient/appointments?patientEmail=${patientEmail}`,
      {
        method: "POST",
        body: JSON.stringify(appointmentData),
      }
    ),
};

export const doctorAPI = {
  getAppointments: (email: string): Promise<Appointment[]> =>
    apiRequest<Appointment[]>(`/api/doctor/appointments?email=${email}`),

  respondToAppointment: (
    id: number,
    accept: boolean,
    doctorEmail: string
  ): Promise<void> =>
    apiRequest<void>(
      `/api/doctor/appointments/${id}/respond?accept=${accept}&doctorEmail=${doctorEmail}`,
      {
        method: "PATCH",
      }
    ),
};
