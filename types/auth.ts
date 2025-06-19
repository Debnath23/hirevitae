// Represents the shape of a user
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Global authentication state
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Data required for user registration
export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

// Data required for login
export interface LoginData {
  email: string;
  password: string;
}

// Response from the server after login or registration
export interface AuthResponse {
  token: string; // Access token
  refreshToken: string;
  user: User;
}

// Authentication context type (e.g., for React Context API)
export interface AuthContextType extends AuthState {
  signUp: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
