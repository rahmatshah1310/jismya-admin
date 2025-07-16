import axios from "axios";

export const sendRequest = async (configs) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const headers = { ...(configs.headers || {}) };

  if (configs.data instanceof FormData) {
    delete headers["Content-Type"];
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const requestConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    ...configs,
    headers,
  };

  try {
    return await axios(requestConfig);
  } catch (error) {
    console.error("AXIOS ERROR", error);

    if (axios.isAxiosError(error)) {
      if (error.code === "ERR_CANCELED") return Promise.reject(error);

      const errorData = error.response?.data;

      const responseError = errorData?.errors || errorData?.data || errorData?.message;

      if (responseError) {
        if (typeof responseError === "string") {
          return Promise.reject(responseError);
        }

        if (typeof responseError === "object") {
          const messages = Object.entries(responseError).map(
            ([field, value]) => Array.isArray(value)
              ? `${field}: ${value.join(", ")}`
              : `${field}: ${value}`
          );
          return Promise.reject(messages.join("\n"));
        }
      }
    }

    return Promise.reject("An unknown error occurred");
  }

};

