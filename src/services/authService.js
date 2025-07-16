import { sendRequest } from "@/services/sendingRequests";

export const login = async (data) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: "/auth/login",
      data,
    });
    return response.data;
  } catch (error) {
    console.log(`Auth Service [login] error: ${error}`);
    throw error;
  }
};

export const me = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/auth/me",
    });
    return response.data;
  } catch (error) {
    console.log(`Auth Service [me] error: ${error}`);
    throw error;
  }
};

export const authService = {
  login,
  me,
};
