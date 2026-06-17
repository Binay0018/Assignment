// src/components/ActivityFeed.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import ActivityCard from './ActivityCard';

// ─── API helper ───────────────────────────────────────────
const fetchActivities = async (cursor, filter) => {
  const params = new URLSearchParams({ limit: 20 });
  if (cursor) params.append('cursor', cursor);
  if (filter) params.append('type', filter);

  const res = await fetch(`/api/activities?${params}`, {
    headers: { 'x-tenant-id': 'company-abc' }
  });

  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};


// ─── Main component ───────────────────────────────────────
export default function ActivityFeed() {

  const [activities, setActivities] = useState([]);
  const [cursor, setCursor]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [hasMore, setHasMore]       = useState(true);
  const [filter, setFilter]         = useState('');

  const bottomRef   = useRef(null);
  const observerRef = useRef(null);


  // ─── loadMore ────────────────────────────────────────────
  const loadMore = useCallback(async (currentCursor, currentFilter) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { data, nextCursor } = await fetchActivities(currentCursor, currentFilter);

      setActivities(prev => {
        const existingIds = new Set(prev.map(item => item._id));

        const uniqueData = data.filter(
          item => item && !existingIds.has(item._id)
        );

        return [...prev, ...uniqueData];
      });
      setCursor(nextCursor);
      if (!nextCursor) setHasMore(false);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);


  // ─── Optimistic UI — create activity ─────────────────────
  const createActivity = async (newActivityData) => {

    // STEP 1: Make a fake temporary item with a temp ID
    const tempActivity = {
      _id: `temp-${Date.now()}`,  // unique fake ID
      ...newActivityData,
      createdAt: new Date().toISOString(),
      isPending: true             // flag = "not saved yet"
    };

    // STEP 2: Add it to the top of the list IMMEDIATELY
    // User sees it right away before the API even responds
    setActivities(prev => [tempActivity, ...prev]);

 
    try {
      // STEP 3: Call the real API in background
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': 'company-abc'
        },
        body: JSON.stringify(newActivityData)
      });

      if (!res.ok) throw new Error('Server error');

      const { data: savedActivity } = await res.json();

      // STEP 4 (success): Swap fake item with real saved document
      // Find by the temp ID and replace it
      if (savedActivity && savedActivity._id) {
        setActivities(prev =>
          prev.map(activity =>
            activity._id === tempActivity._id ? savedActivity : activity
          )
        );
      } else {
        // If savedActivity is invalid, remove the temp one
        setActivities(prev =>
          prev.filter(activity => activity._id !== tempActivity._id)
        );
      }

    } catch (error) {
      // STEP 5 (failure): ROLLBACK — remove the fake item
      // Act like it never happened
      setActivities(prev =>
        prev.filter(activity => activity._id !== tempActivity._id)
      );
      alert('Failed to post activity. Please try again.');
      console.error('Create activity error:', error);
    }
  };


  // ─── useEffect #1 — Load on mount, reset on filter change ─
  useEffect(() => {
    setActivities([]);
    setCursor(null);
    setHasMore(true);
    loadMore(null, filter);
  }, [filter]);


  // ─── useEffect #2 — Infinite scroll ──────────────────────
  useEffect(() => {
    if (!bottomRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        if (isVisible && hasMore && !loading) {
          loadMore(cursor, filter);
        }
      },
      { threshold: 1.0 }
    );

    observerRef.current.observe(bottomRef.current);
    return () => observerRef.current?.disconnect();

  }, [cursor, hasMore, loading, filter, loadMore]);


  // ─── useEffect #3 — Real-time polling every 10 seconds ───
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { data } = await fetchActivities(null, filter);
        setActivities(prev => {
          const existingIds = new Set(prev.map(a => a._id));
          const newItems = data.filter(a => !existingIds.has(a._id));
          return newItems.length > 0 ? [...newItems, ...prev] : prev;
        });
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [filter]);

console.log("Activities:", activities);
  // ─── RENDER ──────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
      <h2>Activity Feed</h2>

      {/* ── Post Activity button (Optimistic UI) ── */}
      <div style={{
        marginBottom: '20px',
        padding: '12px 16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '14px', color: '#555' }}>
          Post as Binay Kumar:
        </span>
        {['like', 'comment', 'share'].map(type => (
          <button
            key={type}
            onClick={() => createActivity({
              actorId:  'user-001',
              actorName: 'Binay Kumar',
              type,
              entityId: `post-${Date.now()}`,
              metadata: {}
            })}
            style={{
              padding: '6px 14px',
              background: '#6c63ff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* ── Filter buttons ── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['', 'like', 'comment', 'share'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              background: filter === type ? '#6c63ff' : '#fff',
              color:      filter === type ? '#fff'    : '#333',
              cursor: 'pointer'
            }}
          >
            {type === '' ? 'All' : type}
          </button>
        ))}
      </div>

      {/* ── Activity list ── */}
      {activities
  .filter(activity => activity && typeof activity === 'object' && activity._id)
  .map(activity => {
    if (!activity || !activity._id) return null;
    return (
      <ActivityCard
        key={activity._id}
        activity={activity}
      />
    );
  })}
      {/* ── Empty state ── */}
      {!loading && activities.length === 0 && (
        <div style={{ textAlign: 'center', color: '#aaa', padding: '40px 0' }}>
          <p>No activities found.</p>
          <p style={{ fontSize: '13px' }}>
            {filter ? `Try removing the "${filter}" filter.` : 'Create some activities first.'}
          </p>
        </div>
      )}

      {/* ── Loading spinner ── */}
      {loading && (
        <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
      )}

      {/* ── End of list ── */}
      {!hasMore && activities.length > 0 && (
        <p style={{ textAlign: 'center', color: '#aaa', fontSize: '13px' }}>
          You have seen all activities.
        </p>
      )}

      {/* ── Invisible bottom div for IntersectionObserver ── */}
      <div ref={bottomRef} style={{ height: '1px' }} />
    </div>
  );
}
