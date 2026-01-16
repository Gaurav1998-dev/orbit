'use client';

import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';

export default function Home() {
  const { data, isLoading, error } = useQuery(trpc.getTodos.queryOptions({ name: 'John Doe' }));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.message}</div>;
}