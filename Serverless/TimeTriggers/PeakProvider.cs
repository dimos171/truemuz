using NAudio.Wave;
using NAudio.Wave.SampleProviders;
using System;
using System.Linq;

namespace TimeTriggers
{
    public class PeakProvider 
    {
        private SampleChannel _sampleChannel { get; set; }
        private int _samplesPerPeak { get; set; }

        private int _sampleInterval { get; set; }
        private float[] _readBuffer { get; set; }

        private float _scale { get; set; }

        public void Init(MediaFoundationReader reader, int samplesPerPeak, int sampleInterval, float scale)
        {
            _sampleChannel = new SampleChannel(reader, false);
            _samplesPerPeak = samplesPerPeak;
            _readBuffer = new float[samplesPerPeak];
            _sampleInterval = sampleInterval;
            _scale = scale;
        }

        public float GetNextPeak()
        {
            var samplesRead = _sampleChannel.Read(_readBuffer, 0, _readBuffer.Length);

            var peak = 0.0f;


            var sum = (samplesRead == 0) ? 0 : _readBuffer.Take(samplesRead).Select(s => Math.Abs(s)).Sum();
            var average = sum / samplesRead;

            return average * _scale;
        }
    }
}