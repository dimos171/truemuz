import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';

import HorizontalDragScroll from '../HorizontalDragScroll';
import { setTag } from '../../store/actions';
import './index.scss';

TagsList.propTypes = {
  tags: PropTypes.array,
  setTag: PropTypes.func,
};

const mapStateToProps = state => ({
  tags: state.selectedBand.tags,
});

const mapDispatchToProps = dispatch => ({
  setTag: (tagName, value) => dispatch(setTag(tagName, value)),
});

function TagsList(props) {
  const handleClick = (tag) => {
    props.setTag(tag.name, !tag.isActive);
  };

  return (
    <HorizontalDragScroll>
      <ul className="d-flex p-0 my-2 tags-list">
        {props.tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag.name}
            className="m-1 icon"
            onClick={() => handleClick(tag)}
            color={tag.isActive ? 'primary' : 'default'}
            clickable 
          />
        ))}
      </ul>
    </HorizontalDragScroll>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(TagsList));
