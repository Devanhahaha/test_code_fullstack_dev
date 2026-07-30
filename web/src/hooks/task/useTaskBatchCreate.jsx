import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from 'js-cookie';
import Api from "../../services/Api";

const useTaskBatchCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, tasks }) => {
      const token = Cookies.get('token');
      const response = await Api.post(`/projects/${projectId}/tasks/batch`, { tasks }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export default useTaskBatchCreate;