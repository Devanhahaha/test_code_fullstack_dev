import { useContext } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { AuthContext } from "../../context/AuthContext";

const useLogout = () => {

    const authContext = useContext(AuthContext);

    const { setIsAuthenticated } = authContext;

    const navigate = useNavigate();

    const Logout = () => {
        Cookies.remove('token');
        Cookies.remove('user');

        setIsAuthenticated(false);

        navigate('/');
    };

    return Logout;
};

export default useLogout