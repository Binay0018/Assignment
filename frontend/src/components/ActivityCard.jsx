import React, { memo } from 'react';
const ActivityCard = React.memo(({ activity }) => {
  return (
    <div style={{
      padding: '12px 16px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      marginBottom: '10px',
      opacity: activity.isPending ? 0.5 : 1
    }}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>
        {activity.actorName}
        <span style={{ fontWeight: 'normal', color: '#555' }}>
          {' '}did a {activity.type}
        </span>
      </p>

      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>
        On entity: {activity.entityId}
      </p>

      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#aaa' }}>
        {new Date(activity.createdAt).toLocaleString()}
      </p>

      {activity.isPending && (
        <span style={{ fontSize: '11px', color: '#f90' }}>Saving...</span>
      )}
    </div>
  );
});

export default ActivityCard;