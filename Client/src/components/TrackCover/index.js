import React from 'react';

import avatar from '../../../public/images/img_avatar.png';
import './index.scss';

export default function TrackCover() {
  return (
    <div className="col-2 px-0 mt-3 pt-2">
      <div className="d-flex align-items-center justify-content-center mb-5 pb-3">
        <img className="rounded-avatar mx-2" src={avatar} />
        <img className="rounded-avatar mx-2" src={avatar} />
        <img className="rounded-avatar mx-2" src={avatar} />
        <img className="rounded-avatar mx-2" src={avatar} />
      </div>

      <div className="cover-container">
        <img className="cover-container-image p-2" src='https://truemuz.blob.core.windows.net/songs/Modernova/DoWhatYouFeel/Logo.jpg' />
        <div className="cover-container-border"></div>
      </div>
    </div>
  );
}
