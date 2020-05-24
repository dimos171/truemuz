import React from 'react';
import PropTypes from 'prop-types';

import { getBlobBaseUrl } from '../../shared/utilities';
import './index.scss';

TrackCover.propTypes = {
  bandName: PropTypes.string,
  albumName: PropTypes.string,
  members: PropTypes.array,
};

export default function TrackCover(props) {

  const bandPath = `${getBlobBaseUrl()}/${props.bandName}`;
  const logoPath = `${bandPath}/${props.albumName}/Logo.jpg`;

  return (
    <div className="col-2 px-0 mt-3 pt-2">
      <div className="d-flex align-items-center justify-content-center mb-5 pb-3">
        {props.members.map((member) => {                    
            const src = `${bandPath}/${member.name}.png`;
            return (<img key={member.name} className="rounded-avatar mx-2" src={src} title={member.name}/>);
        })}
      </div>

      <div className="cover-container">
        <img className="cover-container-image p-2" src={logoPath} />
        <div className="cover-container-border"></div>
      </div>
    </div>
  );
}