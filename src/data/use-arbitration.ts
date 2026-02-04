import { useQuery } from '@tanstack/react-query';
import { useRPC } from '../lib/rpc-client';

interface UseArbitrationOptions {
    disputeId?: string;
    address?: string;
    resolved?: boolean;
    page?: number;
    pageSize?: number;
    activeTab?: 'pending' | 'completed' | 'my-votes';
}

export function useArbitration(options?: UseArbitrationOptions) {
    const rpc = useRPC();
    const address = options?.address;
    const activeTab = options?.activeTab ?? 'pending';
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 6;
    const disputeId = options?.disputeId

    // 统计数据查询 - 始终加载
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


    // 待处理仲裁列表 - 仅在 pending tab 激活时加载
    const pendingArbitrations = useQuery({
        queryKey: ['fetchArbitrations', 'pending', false, page, pageSize],
        queryFn: async () => {
            const result = await rpc.request('fetchArbitrations', [false, page, pageSize]);
            return result;
        },
        enabled: activeTab === 'pending',
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        gcTime: 0, // 切换 tab 后立即清除缓存
    });

    // 已完成仲裁列表 - 仅在 completed tab 激活时加载
    const completedArbitrations = useQuery({
        queryKey: ['fetchArbitrations', 'completed', true, page, pageSize],
        queryFn: async () => {
            const result = await rpc.request('fetchArbitrations', [true, page, pageSize]);
            return result;
        },
        enabled: activeTab === 'completed',
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        gcTime: 0, // 切换 tab 后立即清除缓存
    });

    // 我的投票记录 - 仅在 my-votes tab 激活时加载
    const myVotes = useQuery({
        queryKey: ['searchArbitrations', 'my-votes', undefined, address, page, pageSize],
        queryFn: async () => {
            const result = await rpc.request('searchArbitrations', [undefined, address, page, pageSize]);
            return result;
        },
        enabled: activeTab === 'my-votes' && !!address,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        gcTime: 0, // 切换 tab 后立即清除缓存
    });

    const arbitration = useQuery({
        queryKey: ['fetchArbitration', disputeId],
        queryFn: async () => {
            const result = await rpc.request('fetchArbitration', [disputeId]);
            return result;
        },
        enabled: !!disputeId,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    })

    return {
        statistics,
        pendingArbitrations,
        completedArbitrations,
        myVotes,
        arbitration
    }
}
