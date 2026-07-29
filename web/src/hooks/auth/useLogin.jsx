import { useMutation } from "@tanstack/react-query";
import Api from "../../services/Api";

const useLogin = () => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await Api.post('/auth/login', data);

            return response.data;
        }
    })
}

export default useLogin;