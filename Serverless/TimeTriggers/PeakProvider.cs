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

        public void Init(MediaFoundationReader reader, int samplesPerPeak, int sampleInterval)
        {
            _sampleChannel = new SampleChannel(reader, false);
            _samplesPerPeak = samplesPerPeak;
            _readBuffer = new float[samplesPerPeak];
            _sampleInterval = sampleInterval;
        }

        public float GetNextPeak()
        {
            var samplesRead = _sampleChannel.Read(_readBuffer, 0, _readBuffer.Length);

            var peak = 0.0f;
            for (int x = 0; x < samplesRead; x += _sampleInterval)
            {
                peak = Math.Max(peak, _readBuffer[x]);
            }

            return peak;
        }
    }
}