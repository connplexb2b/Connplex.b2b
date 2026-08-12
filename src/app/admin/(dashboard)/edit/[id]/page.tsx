'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MediaForm from '@/components/admin/MediaForm';
import type { MediaEntry } from '@/lib/media-utils';

export default function AdminEditPage() {
  const params = useParams();
  const id = params?.id as string;
  const [entry, setEntry] = useState<MediaEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/media/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setEntry(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="admin-card admin-empty">Loading…</div>;
  }

  if (!entry) {
    return <div className="admin-card admin-empty">Entry not found.</div>;
  }

  return <MediaForm mode="edit" initial={entry} />;
}
