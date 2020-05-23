import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

TrackDescription.propTypes = {
  wiki: PropTypes.string,
};

export default function TrackDescription(props) {
  function createMarkup() {
    return {__html: props.wiki};
  }
  return (
    <div className="col-4 offset-1 px-0 mt-3 pt-2">
      <div>
        <h5 className="mb-3 pb-2">
          TRACK HISTORY
        </h5>
      </div>

      <div className="description-text" dangerouslySetInnerHTML={createMarkup()}>   
      </div>
    </div>
  );
}
