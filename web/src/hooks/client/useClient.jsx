import Api from '../../services/Api';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

const useClient = () => {
  return useQuery({
    queryKey: ['clients'],

    queryFn: async () => {
        const token = Cookies.get('token');
        const response = await Api.get('/clients', {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        
        return response.data.data;
    },
  });
};

export default useClient;