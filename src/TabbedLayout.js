import React, { useState } from 'react';

const TabbedLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tabbed-layout">
      <div className="tab-buttons">
        {React.Children.map(children, (child, index) => (
          <button
            key={index}
            className={activeTab === index ? 'active' : ''}
            onClick={() => setActiveTab(index)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {React.Children.toArray(children)[activeTab]}
      </div>
    </div>
  );
};

export default TabbedLayout;
