import Cookies from 'js-cookie';

const useUser = () => {
  const user = Cookies.get('user');
  return user ? JSON.parse(user) : null;
}

export default useUser;