import { getData, setData } from '@/lib/storage';

const AUTH_LOCAL_STORAGE_KEY = `token`;

/**
 * Get stored auth information from local storage
 */
const getAuth = () => {
  try {
    const auth = getData(AUTH_LOCAL_STORAGE_KEY);
    return auth;
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

/**
 * Save auth information to local storage
 */
const setAuth = (auth) => {
  setData(AUTH_LOCAL_STORAGE_KEY, auth);
};

const getUser = () => {
  return getData("user");
}


const setUser = (user) => {
  setData("user", user);
}

const setAccountType = (user) => {
  setData("accountType", user?.account_type);
}

/**
 * Remove auth information from local storage
 */
const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    // localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth, getUser, setUser, setAccountType };
