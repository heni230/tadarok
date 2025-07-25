import React from "react";

const PageWrapper = ({ emoji = "📄", title = "عنوان", children }) => (
  <div className="full-background">
    <div className="transparent-box">
      <h2>{emoji} {title}</h2>
      {children}
    </div>
  </div>
);

export default PageWrapper;
