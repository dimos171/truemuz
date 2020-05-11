export default () => {
    return new Promise((resolve) => {
      const idSelector = 'videojs-hls-lib';
      const version = '5.15.0';
  
      if (document.querySelector(`#${idSelector}`)) {
        return resolve();
      }
  
      const scriptTag = document.createElement('script');
      scriptTag.id = idSelector;
      scriptTag.defer = true;
      scriptTag.src = `https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/${version}/videojs-contrib-hls.js`;
  
      document.body.appendChild(scriptTag);
      scriptTag.onload = () => resolve();
    });
  };
  