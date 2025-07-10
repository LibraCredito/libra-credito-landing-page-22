import { useEffect } from 'react';

const RASeal = () => {
  useEffect(() => {
    const container = document.getElementById('ra-verified-seal');
    if (!container) return;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'ra-embed-verified-seal';
    script.src = 'https://s3.amazonaws.com/raichu-beta/ra-verified/bundle.js';
    script.dataset.id = 'Y21PdzlSbG1iOEw4ZWVzMDpsaWJyYS1jcmVkaXRvLXNvbHVjb2VzLWZpbmFuY2VpcmFz';
    script.dataset.target = 'ra-verified-seal';
    script.dataset.model = '2';
    container.appendChild(script);
  }, []);

  return <div id="ra-verified-seal" />;
};

export default RASeal;
