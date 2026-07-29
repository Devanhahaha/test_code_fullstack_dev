import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/Api";
import Cookies from 'js-cookie';

const useClientDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const token = Cookies.get('token');
            const response = await Api.delete(`/clients/${id}`, {
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

export default useClientDelete;