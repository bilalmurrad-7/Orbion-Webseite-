import React from 'react';

function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Green Orb - Top Right */}
      <div
        className="orb orb-green"
        style={{
          width: '300px',
          height: '300px',
          top: '10%',
          right: '5%',
        }}
      />

      {/* Blue Orb - Bottom Left */}
      <div
        className="orb orb-blue"
        style={{
          width: '400px',
          height: '400px',
          bottom: '5%',
          left: '2%',
        }}
      />

      {/* Green Orb - Center */}
      <div
        className="orb orb-green"
        style={{
          width: '250px',
          height: '250px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.15,
        }}
      />
    </div>
  );
}

export default AmbientBackground;
