import React from 'react';
// Mock UI Kitten components for React Native
const Card = ({ children }: any) => <div className="card">{children}</div>;
const Text = ({ children, category }: any) => <span className={`text-${category}`}>{children}</span>;

interface SabaqRecord {
  id: string;
  juz_number: number;
  page_start: number;
  page_end: number;
  grade: 'excellent' | 'good' | 'average' | 'needs_improvement';
}

/**
 * Mobile Offline-First Progress Card.
 * Reads directly from WatermelonDB Local Store with zero network latency.
 */
export const SabaqProgressCard: React.FC<{ record: SabaqRecord }> = ({ record }) => {
  return (
    <Card>
      <Text category="h5">Juz {record.juz_number}</Text>
      <Text category="s1">Pages: {record.page_start} - {record.page_end}</Text>
      <Text category="label">Grade: {record.grade.toUpperCase()}</Text>
    </Card>
  );
};
