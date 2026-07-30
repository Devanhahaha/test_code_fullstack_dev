import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import Api from '../../services/Api';

const useTask = () => {
  return useQuery({
    queryKey: ['tasks'],

    queryFn: async () =>{
        const token = Cookies.get('token');
        const response = await Api.get('/tasks', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.data; 
    },
  });
};

export default useTask;