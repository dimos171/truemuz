import React from 'react';
import PropTypes from 'prop-types';
import { AiOutlineFacebook, AiOutlineInstagram } from "react-icons/ai";
import Icon24LogoVk from '@vkontakte/icons/dist/24/logo_vk';

import { getBlobBaseUrl } from '../../shared/utilities';
import './index.scss';

TrackCover.propTypes = {
  bandName: PropTypes.string,
  albumName: PropTypes.string,
  members: PropTypes.array,
  socialNet: PropTypes.array,
  net: PropTypes.object,
};

function TrackCover(props) {
  const bandPath = `${getBlobBaseUrl()}/${props.bandName}`;
  const logoPath = `${bandPath}/${props.albumName}/Logo.jpg`;

  const SocialNerwork = (props) => {
    switch(props.net.type) {
      case 'fb':
        return (<a href={props.net.link} target="_blank" rel="noopener noreferrer" className="p-2" ><AiOutlineFacebook className="social-net"></AiOutlineFacebook></a>);
      case 'inst':
        return (<a href={props.net.link} target="_blank" rel="noopener noreferrer" className="p-2"><AiOutlineInstagram className="social-net"></AiOutlineInstagram></a>);
      case 'vk':
        return (<a href={props.net.link} target="_blank" rel="noopener noreferrer" className="p-2"><Icon24LogoVk className="social-net"/></a>);
      default:
        return (<a href={props.net.link} target="_blank" rel="noopener noreferrer" className="social-net p-2">{props.net.type}</a>);
    }
  };

  return (
    <div className="col-12 col-lg-2 px-0 mt-3 pt-2 order-0">
      <div className="align-items-center justify-content-center mb-5 pb-3 d-none d-lg-flex">
        {props.members.map((member) => {                    
            const src = `${bandPath}/${member.name}.png`;
            return (<img key={member.name} className="rounded-avatar mx-2" src={src} title={member.name}/>);
        })}
      </div>
      
      <div className="d-flex align-items-center justify-content-center">
        <div className="cover-container">
          <img className="cover-container-image p-2" src={logoPath} />
          <div className="cover-container-border d-none d-lg-block"></div>
        </div>
      </div>

      <div className="align-items-center justify-content-center d-none d-lg-flex">
          {props.socialNet.map((net) => {     
              return (<SocialNerwork key={net.type} net={net}/>);
          })}
      </div>
    </div>
  );
}

export default React.memo(TrackCover);
