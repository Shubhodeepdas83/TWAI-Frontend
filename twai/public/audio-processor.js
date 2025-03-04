// public/audio-processor.js
class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this.bufferSize = 4096;
      this.buffer = new Float32Array(this.bufferSize);
      this.bufferIndex = 0;
    }
  
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      if (!input || !input[0]) return true;
  
      const audioData = input[0];
  
      // Convert to Int16 format which is what AssemblyAI expects
      const audioInt16 = new Int16Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        // Convert float32 audio to int16
        audioInt16[i] = Math.max(-1, Math.min(1, audioData[i])) * 0x7FFF;
      }
  
      // Send the audio data to the main thread
      this.port.postMessage({
        audio_data: audioInt16.buffer
      }, [audioInt16.buffer]);
  
      return true;
    }
  }
  
  registerProcessor('audio-processor', AudioProcessor);