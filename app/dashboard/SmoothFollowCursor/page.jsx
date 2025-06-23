import React from "react";
import SmoothFollowCursor from "./component";

const page = () => {
  return (
      <div>
          <SmoothFollowCursor
              dotColor="violet" // Color of the inner dot
              borderColor="rgba(156, 39, 176, 0.5)" // Color of the border
              dotSize={10} // Size of inner dot in px
              borderSize={30} // Default size of outer circle
              hoverBorderSize={50} // Size when hovering interactive elements
              dotSpeed={0.4} // How fast dot follows (0.1-1)
              borderSpeed={0.15} // How fast circle follows (0.1-1)
              dotOpacity={1} // Dot opacity (0-1)
              borderOpacity={0.8} // Circle opacity (0-1)
              borderWidth={3} // Border thickness in px
          />
      </div>
  );
};

export default page;
