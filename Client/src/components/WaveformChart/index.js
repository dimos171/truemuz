import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import styles from  '../../shared/variables/_colors.scss';

WaveformChart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  currentPlayTime: PropTypes.number,
  activeTrack: PropTypes.object,
  setForcedCurrentPlayTime: PropTypes.func,
};

const MOUSE_MOVE_THRESHOLD = 30;
const BARS_OFFSET = 4;
const BAR_WIDTH = 2;
const DEFAULT_BAR_COLOR = styles.waveformBarDefaultColor;
const HOVERED_BAR_COLOR = styles.waveformBarHoveredBarColor;
const ACTIVE_BAR_COLOR = styles.waveformBarActiveBarColor;

function WaveformChart(props) {
  const canvasRef = useRef(null);
  const waveformData = useRef(null);

  const [lastMouseMoveTime, setLastMouseMoveTime] = useState(0);
  const [hoveredBarsCount, setHoveredBarsCount] = useState(0);
  const [isCursorOnWaveform, setIsCursorOnWaveform] = useState(false);

  const handleMouseMove = (event) => {
    const now = +new Date;

    if (now - lastMouseMoveTime > MOUSE_MOVE_THRESHOLD) {
      const canvasCtx = setupCanvas(ACTIVE_BAR_COLOR);
      const barsCount = Math.floor(props.width / BARS_OFFSET);
      const coloredBarsCountByHover = Math.floor(event.nativeEvent.offsetX / BARS_OFFSET);
      const alreadyPlayedBarsCount = Math.floor((props.currentPlayTime / props.activeTrack.duration) * barsCount);

      setLastMouseMoveTime(now);
      setHoveredBarsCount(coloredBarsCountByHover);
      setIsCursorOnWaveform(true);
  
      drawWaveformData(canvasCtx, barsCount, alreadyPlayedBarsCount);
    }
  };

  const handleMouseLeave = () => {
    const canvasCtx = setupCanvas(ACTIVE_BAR_COLOR);
    const barsCount = Math.floor(props.width / BARS_OFFSET);
    const alreadyPlayedBarsCount = Math.floor((props.currentPlayTime / props.activeTrack.duration) * barsCount);

    setHoveredBarsCount(0);
    setIsCursorOnWaveform(false);

    drawWaveformData(canvasCtx, barsCount, alreadyPlayedBarsCount);
  };

  const setupCanvas = (strokeColor) => {
    const canvasCtx = canvasRef.current.getContext('2d');
    canvasCtx.clearRect(0, 0, props.width, props.height);
    canvasCtx.lineWidth = BAR_WIDTH;
    canvasCtx.strokeStyle = strokeColor;

    return canvasCtx;
  };

  const drawLine = (canvasCtx, x, y, offset) => {
    canvasCtx.beginPath();
    canvasCtx.moveTo(x, y);
    canvasCtx.lineTo(x, y - Math.floor(29 * offset));
    canvasCtx.stroke();
  };

  const handleMouseClick = (event) => {
    const clickPositionX = event.clientX - event.target.offsetLeft;
    const playedPercentage = clickPositionX / props.width;
    const playtime = props.activeTrack.duration * playedPercentage;

    props.setForcedCurrentPlayTime(playtime);
  };

  const getAverageSampleForWaveform = (sample, chunksCount) => {
    const chunkedArray = [];
    const basedChunkLength = Math.ceil(sample.length / chunksCount);
    const itemsWithBasedLengthCount = sample.length % chunksCount;
    const itemsWithDecreasedLengthCount = chunksCount - itemsWithBasedLengthCount;
    const itemsWithDecreasedLengthFrequency = Math.floor(chunksCount / itemsWithDecreasedLengthCount);
    let itemsWithDescreasedLengthAdded = 0;

    for (let chunkIndex = 0, sampleIndex = 0; chunkIndex < chunksCount; chunkIndex++, sampleIndex += basedChunkLength) {
      if (
        chunkIndex % itemsWithDecreasedLengthFrequency === 0
        && itemsWithDescreasedLengthAdded !== itemsWithDecreasedLengthCount
      ) {
        const decreasedAmount = sample
          .slice(sampleIndex, sampleIndex + basedChunkLength - 1)
          .reduce((a, b) => a + b);

        chunkedArray.push(decreasedAmount / (basedChunkLength - 1));
        itemsWithDescreasedLengthAdded++;
        sampleIndex--;
      } else {
        const basedAmount = sample
          .slice(sampleIndex, sampleIndex + basedChunkLength)
          .reduce((a, b) => a + b);

        chunkedArray.push(basedAmount / basedChunkLength);
      }
    }

    return chunkedArray;
  };

  const drawWaveformData = (canvasCtx, barsCount, alreadyPlayedBarsCount) => {
    let x = BAR_WIDTH;
    let startIndexForEmptyBars = alreadyPlayedBarsCount;

    for (let index = 0; index < alreadyPlayedBarsCount; index++, x += BARS_OFFSET) {
      drawLine(canvasCtx, x, props.height, waveformData.current[index]);
    }

    if (isCursorOnWaveform && hoveredBarsCount > alreadyPlayedBarsCount) {
      canvasCtx.strokeStyle = HOVERED_BAR_COLOR;
      startIndexForEmptyBars = hoveredBarsCount;

      for (let index = alreadyPlayedBarsCount; index < hoveredBarsCount; index++, x += BARS_OFFSET) {
        drawLine(canvasCtx, x, props.height, waveformData.current[index]);
      }
    }

    canvasCtx.strokeStyle = DEFAULT_BAR_COLOR;

    for (let index = startIndexForEmptyBars; index < barsCount; index++, x += BARS_OFFSET) {
      drawLine(canvasCtx, x, props.height, waveformData.current[index]);
    }
  };

  useEffect(() => {
    const canvasCtx = setupCanvas(ACTIVE_BAR_COLOR);
    const barsCount = Math.floor(props.width / BARS_OFFSET);
    const alreadyPlayedBarsCount = Math.floor((props.currentPlayTime / props.activeTrack.duration) * barsCount);

    waveformData.current = getAverageSampleForWaveform(props.activeTrack.waveForm, barsCount);

    drawWaveformData(canvasCtx, barsCount, alreadyPlayedBarsCount);
  });

  return (
    <canvas
      className='icon'
      ref={canvasRef}
      width={props.width}
      height={props.height}
      onClick={handleMouseClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    ></canvas>
  );
}

export default React.memo(WaveformChart);
