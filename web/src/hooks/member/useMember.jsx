import { useQuery } from '@tanstack/react-query';
import Api from '../../services/Api';
import Cookies from 'js-cookie';

const useMember = () => {
    return useQuery({
        queryKey: ['members'],
        queryFn: async () => {
            const token = Cookies.get('token');
            const response = await Api.get('/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.data; 
        },
    });
};

export default useMember;