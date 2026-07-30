import { useContext } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const useLogout = () => {

    const authContext = useContext(AuthContext);

    const { setIsAuthenticated } = authContext;

    const navigate = useNavigate();

    const Logout = () => {
        Cookies.remove('token');
        Cookies.remove('user');

        setIsAuthenticated(false);
        toast.success('Anda Berhasil Logout! Sampai Jumpa Kembali.')
        navigate('/');
    };

    return Logout;
};

export default useLogout