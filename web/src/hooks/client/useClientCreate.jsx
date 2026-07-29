import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/Api";
import Cookies from 'js-cookie';

const useClientCreate = () => {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: async (data) => {
        const token = Cookies.get('token');
        const response = await Api.post('/clients', data, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['clients'] }); 
    }
  });
};

export default useClientCreate;