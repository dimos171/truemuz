export default () => {
  return new Promise((resolve) => {
    const idSelector = 'videojs-lib';
    const version = '7.8.1';

    if (document.querySelector(`#${idSelector}`)) {
      return resolve();
    }

    const scriptTag = document.createElement('script');
    scriptTag.id = idSelector;
    scriptTag.defer = true;
    scriptTag.src = `https://cdnjs.cloudflare.com/ajax/libs/video.js/${version}/video.min.js`;

    document.body.appendChild(scriptTag);
    scriptTag.onload = () => resolve();
  });
};
  