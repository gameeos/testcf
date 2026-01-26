import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ResolutionsPage } from '@/pages/resolutions';
import { ResolutionDetailPage } from '@/pages/resolution-detail';
import { ChallengeNewPage } from '@/pages/challenge-new';
import { ArbitrationDashboardPage } from '@/pages/arbitration-dashboard';
import { ArbitrationDetailPage } from '@/pages/arbitration-detail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/resolutions" replace />,
  },
  {
    path: '/resolutions',
    element: <ResolutionsPage />,
  },
  {
    path: '/resolution/:id',
    element: <ResolutionDetailPage />,
  },
  {
    path: '/challenge/new',
    element: <ChallengeNewPage />,
  },
  {
    path: '/arbitration',
    element: <ArbitrationDashboardPage />,
  },
  {
    path: '/arbitration/:disputeId',
    element: <ArbitrationDetailPage />,
  },
]);
