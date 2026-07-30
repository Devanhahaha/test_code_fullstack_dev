import { useQuery } from '@tanstack/react-query';
import Api from '../../services/Api';
import Cookies from 'js-cookie';

const useProject = () => {
  return useQuery({
    queryKey: ['projects'],

    queryFn: async () => {
        const token = Cookies.get('token');
        const response = await Api.get('/projects', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.data;
    },
  });
}

export default useProject