import React, { useState } from 'react';

import cover from '../../../public/images/retro_background.jpg';
import avatar from '../../../public/images/img_avatar.png';
import './index.scss';

export default function TrackCover(props) {
  return (
    <div className="col-2 px-0 mt-3 pt-2">
      <div className="d-flex align-items-center justify-content-center mb-3 pb-2">
        <img className="rounded-avatar mx-2" src={avatar} />
        <img className="rounded-avatar mx-2" src={avatar} />
        <img className="rounded-avatar mx-2" src={avatar} />
        <img className="rounded-avatar mx-2" src={avatar} />
      </div>

      <div className="cover-container">
        <img className="cover-container-image" src={cover} />
      </div>
    </div>
  );
}
