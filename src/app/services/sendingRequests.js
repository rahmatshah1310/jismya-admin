import axios from "axios";

export const sendRequest = async (configs) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const headers = { ...(configs.headers || {}) };

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

      const responseError =
        error.response?.data?.data || error.response?.data?.message;

      if (responseError) {
        if (typeof responseError === "string") {
          return Promise.reject(responseError);
        }

        if (typeof responseError === "object" && responseError !== null) {
          const messages = [];

          Object.entries(responseError).forEach(([field, value]) => {
            if (Array.isArray(value)) {
              value.forEach((msg) => messages.push(`${field}: ${msg}`));
            } else {
              messages.push(`${field}: ${value}`);
            }
          });

          return Promise.reject(messages.join("\n"));
        }
      }
    }

    return Promise.reject("An unknown error occurred");
  }
};

// import axios from "axios";

// export const sendRequest = async (configs) => {
//   const token =
//     typeof window !== "undefined"
//       ? localStorage.getItem("accessToken")
//       : null;

//   const headers = { ...(configs.headers || {}) };

//   if (token) {
//     headers.Authorization = `Bearer ${token}`;
//   }

//   const requestConfig = {
//     baseURL: process.env.NEXT_PUBLIC_API_URL,
//     ...configs,
//     headers,
//   };

//   try {
//     return await axios(requestConfig);
//   } catch (error) {
//     console.error("AXIOS ERROR", error);

//     if (axios.isAxiosError(error)) {
//       if (error.code === "ERR_CANCELED") return Promise.reject(error);

//       const responseError =
//         error.response?.data?.data || error.response?.data?.message;

//       if (responseError) {
//         if (typeof responseError === "string") {
//           return Promise.reject(responseError);
//         }

//         if (typeof responseError === "object" && responseError !== null) {
//           const messages = [];

//           Object.entries(responseError).forEach(([field, value]) => {
//             if (Array.isArray(value)) {
//               value.forEach((msg) => messages.push(`${field}: ${msg}`));
//             } else {
//               messages.push(`${field}: ${value}`);
//             }
//           });

//           return Promise.reject(messages.join("\n"));
//         }
//       }
//     }

//     return Promise.reject("An unknown error occurred");
//   }
// };
