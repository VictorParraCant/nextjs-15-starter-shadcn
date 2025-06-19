import { Metadata } from 'next';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CategorySummary from '@/components/dashboard/widgets/CategorySummary';
import MonthlyChart from '@/components/dashboard/widgets/MonthlyChart';
import OverviewCards from '@/components/dashboard/widgets/OverviewCards';
import QuickActions from '@/components/dashboard/widgets/QuickActions';
import RecentTransactions from '@/components/dashboard/widgets/RecentTransactions';
import WalletBalance from '@/components/dashboard/widgets/WalletBalance';

import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Panel de control de FIMA'
};

export default function DashboardPage() {
    const t = useTranslations('dashboard');

    return (
        <div className='space-y-8'>
            {/* Header */}
            <DashboardHeader />

            {/* Overview Cards */}
            <OverviewCards />

            {/* Main Content Grid */}
            <div className='grid gap-6 lg:grid-cols-3'>
                {/* Left Column - 2/3 */}
                <div className='space-y-6 lg:col-span-2'>
                    {/* Monthly Chart */}
                    <MonthlyChart />

                    {/* Recent Transactions */}
                    <RecentTransactions />
                </div>

                {/* Right Column - 1/3 */}
                <div className='space-y-6'>
                    {/* Quick Actions */}
                    <QuickActions />

                    {/* Wallet Balances */}
                    <WalletBalance />

                    {/* Category Summary */}
                    <CategorySummary />
                </div>
            </div>
        </div>
    );
}
