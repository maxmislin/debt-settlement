export const getLocalStoragePassword = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("password");
  }

  return "";
};

export const setLocalStoragePassword = (password: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("password", password);
  }
};
