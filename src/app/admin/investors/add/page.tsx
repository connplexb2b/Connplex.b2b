import InvestorForm from '@/components/admin/InvestorForm';
import Link from 'next/link';

export default function AddInvestorPage() {
	return (
		<>
			<div className="admin-page-header">
				<h1>Investors</h1>
				<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
					<Link href="/admin/investors" className="admin-btn admin-btn-outline">
						← Back
					</Link>
				</div>
			</div>
			<InvestorForm mode="create" showHeader={false} />
		</>
	);
}
