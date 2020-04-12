export default () => {
  return new Promise((resolve) => {
    const idSelector = 'amp-library';
    const version = '2.3.4';

    if (document.querySelector(`#${idSelector}`)) {
      return resolve();
    }

    const scriptTag = document.createElement('script');
    scriptTag.id = idSelector;
    scriptTag.defer = true;
    scriptTag.src = `https://amp.azure.net/libs/amp/${version}/azuremediaplayer.min.js`;

    document.body.appendChild(scriptTag);
    scriptTag.onload = () => resolve();
  });
};
