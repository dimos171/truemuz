import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const MOUSE_MOVE_THRESHOLD = 30;

HorizontalDragScroll.propTypes = {
  children: PropTypes.node,
};

function HorizontalDragScroll(props) {
  const ref = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastMouseMoveTime, setLastMouseMoveTime] = useState(0);
  const [clientX, setClientX] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const handleMouseDown = (event) => {
    setIsScrolling(true);
    setClientX(event.clientX);
  };

  const handleMouseUp = () => {
    setIsScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsScrolling(false);
  };

  const handleMouseMove = (event) => {
    const now = +new Date;

    if (isScrolling && (now - lastMouseMoveTime > MOUSE_MOVE_THRESHOLD)) {
      const offset = (scrollX + event.clientX - clientX) > 0
        ? scrollX + event.clientX - clientX
        : 0;

      ref.current.scrollLeft = offset;
      
      setScrollX(offset);
      setClientX(event.clientX);
      setLastMouseMoveTime(now);
    }
  };

  return (
    <div
      ref={ref}
      className="overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {React.Children.map(props.children, child => React.Children.only(child))}
    </div>
  );
}

export default HorizontalDragScroll;
