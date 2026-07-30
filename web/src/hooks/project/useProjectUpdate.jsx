import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/Api";
import Cookies from 'js-cookie';

const useProjectUpdate = () => {
  const queryClient = useQueryClient();
   return useMutation({
    mutationFn: async ({id, data}) => {
        const token = Cookies.get('token');
        const response = await Api.put(`/projects/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
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

export default useProjectUpdate;