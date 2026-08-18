import axios from "axios";

// Resolve the backend origin once, in a single place, instead of repeating the
// `import.meta.env.PROD ? ...` ternary in every data-fetching module.
export const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_ORIGIN
  : "http://localhost:5000";

// Shared axios instance. Callers pass only the path (e.g. "/fpl/getGameweek")
// and the baseURL is prepended automatically.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;
