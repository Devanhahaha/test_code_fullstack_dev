import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from 'js-cookie';
import Api from "../../services/Api";

const useTaskCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
        const token = Cookies.get('token');
        const response = await Api.post('/tasks', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ['tasks'],
        });
    },
  });
};

export default useTaskCreate;