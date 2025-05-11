const iframes = document.querySelectorAll('iframe');

iframes.forEach(iframe => {
    iframe.addEventListener('load', () => {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        iframe.style.height = iframeDocument.documentElement.scrollHeight + 'px';
    });
});