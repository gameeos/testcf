import { useQuery } from '@tanstack/react-query';
import { useRPC } from '../lib/rpc-client';

interface UseArbitrationOptions {
    address?: string;
    resolved?: boolean;
    page?: number;
    pageSize?: number;
}

export function useArbitration(options?: UseArbitrationOptions) {
    const rpc = useRPC();
    const address = options?.address;

    // 统计数据查询
    const statistics = useQuery({
        queryKey: ['arbitrationStatistics', address],
        queryFn: async () => {
            if (!address) {
                throw new Error('arbitrator address is required');
            }
            const result = await rpc.request('arbitrationStatistics', [address]);
            return result;
        },
        enabled: !!address,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });


    // 待处理仲裁列表
    const pendingArbitrations = useQuery({
        queryKey: ['fetchArbitrations', false, options?.page || 1, options?.pageSize || 6],
        queryFn: async () => {
            const result = await rpc.request('fetchArbitrations', [false, options?.page || 1, options?.pageSize || 6]);
            return result;
        },
        enabled: true,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });

    // 已完成仲裁列表
    const completedArbitrations = useQuery({
        queryKey: ['fetchArbitrations', true, options?.page || 1, options?.pageSize || 6],
        queryFn: async () => {
            const result = await rpc.request('fetchArbitrations', [true, options?.page || 1, options?.pageSize || 6]);
            return result;
        },
        enabled: true,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });

    // 我的投票记录
    const myVotes = useQuery({
        queryKey: ['searchArbitrations', undefined, address, options?.page || 1, options?.pageSize || 6],
        queryFn: async () => {
            const result = await rpc.request('searchArbitrations', [undefined, address, options?.page || 1, options?.pageSize || 6]);
            return result;
        },
        enabled: !!address,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });

    return {
        statistics,
        pendingArbitrations,
        completedArbitrations,
        myVotes
    }
}