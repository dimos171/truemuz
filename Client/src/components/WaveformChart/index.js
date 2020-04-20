import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import styles from  '../../shared/variables/_colors.scss';

WaveformChart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  activeTrack: PropTypes.object,
};

const MOUSE_MOVE_THRESHOLD = 30;
const BARS_OFFSET = 4;
const BAR_WIDTH = 2;
const DEFAULT_BAR_COLOR = styles.waveformBarDefaultColor;
const HOVERED_BAR_COLOR = styles.waveformBarHoveredBarColor;

export default function WaveformChart(props) {
  const canvasRef = useRef(null);
  const waveformData = useRef(null);
  let lastMouseMoveTime = 0;

  const handleMouseMove = (event) => {
    const now = +new Date;

    if (now - lastMouseMoveTime > MOUSE_MOVE_THRESHOLD) {
      const canvasCtx = setupCanvas(HOVERED_BAR_COLOR);
      const barsCount = Math.floor(props.width / BARS_OFFSET);
      const coloredBarsCount = Math.floor(event.nativeEvent.offsetX / BARS_OFFSET);
      let x = BAR_WIDTH;
  
      for (let index = 0; index < coloredBarsCount; index++, x += BARS_OFFSET) {
        drawLine(canvasCtx, x, props.height, waveformData.current[index]);
      }
  
      canvasCtx.strokeStyle = DEFAULT_BAR_COLOR;
  
      for (let index = coloredBarsCount; index < barsCount; index++, x += BARS_OFFSET) {
        drawLine(canvasCtx, x, props.height, waveformData.current[index]);
      }

      lastMouseMoveTime = now;
    }
  };

  const handleMouseLeave = () => {
    const canvasCtx = setupCanvas(DEFAULT_BAR_COLOR);
    const barsCount = Math.floor(props.width / BARS_OFFSET);

    for (let index = 0, x = BAR_WIDTH; index < barsCount; index++, x += BARS_OFFSET) {
      drawLine(canvasCtx, x, props.height, waveformData.current[index]);
    }
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

  useEffect(() => {
    const canvasCtx = setupCanvas(DEFAULT_BAR_COLOR);
    const barsCount = Math.floor(props.width / BARS_OFFSET);
    waveformData.current = getAverageSampleForWaveform(props.activeTrack.waveform, barsCount);

    for (let index = 0, x = BAR_WIDTH; index < barsCount; index++, x += BARS_OFFSET) {
      drawLine(canvasCtx, x, props.height, waveformData.current[index]);
    }
  });

  return (
    <canvas
      ref={canvasRef}
      width={props.width}
      height={props.height}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    ></canvas>
  );
}