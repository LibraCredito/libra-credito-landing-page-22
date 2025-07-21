import React from 'react';

const TestComponent = () => {
  const activeTab = 'blog';
  
  return (
    <div>
      {activeTab === 'blog' && (
        <>
          <div>Content</div>
          <div>More content</div>
        </>
      )}
    </div>
  );
};

export default TestComponent;