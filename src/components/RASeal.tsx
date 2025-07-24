import { useEffect } from 'react';

interface RASealProps {
  id?: string;
}

const RASeal: React.FC<RASealProps> = ({ id = 'ra-verified-seal' }) => {
  useEffect(() => {
    const container = document.getElementById(id);
    if (!container) return;
    // Avoid adding the script multiple times to the same container
    if (container.querySelector('script')) return;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = `ra-embed-verified-seal-${id}`;
    script.src = 'https://s3.amazonaws.com/raichu-beta/ra-verified/bundle.js';
    script.dataset.id = 'Y21PdzlSbG1iOEw4ZWVzMDpsaWJyYS1jcmVkaXRvLXNvbHVjb2VzLWZpbmFuY2VpcmFz';
    script.dataset.target = id;
    script.dataset.model = '2';
    container.appendChild(script);
  }, [id]);

  return <div id={id} />;
};

export default RASeal;
