import { getAllLabs, getCategories } from '@/lib/data-server';
import { LabsClient } from '@/components/LabsClient';

export const metadata = { title: '实验室列表 - Neo Labs Tracker' };

export default async function LabsPage() {
  const labs = await getAllLabs();
  const categories = await getCategories();
  return (
    <div className="container">
      <h1 style={{fontSize: 28, fontWeight: 700, marginBottom: 16}}>📋 实验室列表 (25 家)</h1>
      <LabsClient labs={labs} categories={categories} />
    </div>
  );
}
