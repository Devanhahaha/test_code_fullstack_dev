import { useQuery } from '@tanstack/react-query';
import Api from '../../services/Api';
import Cookies from 'js-cookie';

const useDashboardSummary = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboardSummary'],
        queryFn: async () => {
            const response = await Api.get('/dashboard/summary', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            return response.data.data;
        },
    });
    return { 
        summaryData: data, 
        loading: isLoading, 
        error 
    };
};

export default useDashboardSummary;