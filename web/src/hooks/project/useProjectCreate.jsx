import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/Api";
import Cookies from 'js-cookie';

const useProjectCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
        const token = Cookies.get('token');
        const response = await Api.post('/projects', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }); 

        return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
    },
  });
};

export default useProjectCreate;