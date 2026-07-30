import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from 'js-cookie';
import Api from "../../services/Api";

const useProjectDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
        const token = Cookies.get('token');
        const response = await Api.delete(`/projects/${id}`, {
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

export default useProjectDelete;