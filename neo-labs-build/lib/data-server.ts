// Server-only 数据加载
import 'server-only';
import fs from 'fs';
import path from 'path';

export async function getAllLabs(): Promise<any[]> {
  const candidates = [
    path.join(process.cwd(), 'public', 'neo-labs', 'labs.json'),
    path.join(process.cwd(), 'app', 'data', 'neo-labs.json')
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf-8');
        return JSON.parse(content).labs;
      }
    } catch(e) {}
  }
  return [];
}

export async function getMainLabs(): Promise<any[]> {
  const all = await getAllLabs();
  return all.filter(l => l.list_section === 'main').sort((a, b) => a.rank - b.rank);
}

export async function getLabBySlug(slug: string): Promise<any> {
  const all = await getAllLabs();
  return all.find(l => l.slug === slug) || null;
}

export async function getCategories(): Promise<string[]> {
  const all = await getAllLabs();
  return [...new Set(all.map((l: any) => l.category))].sort();
}
