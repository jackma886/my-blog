const blogs = ['2024-10-26', '2024-11-25', '2025-4-1', '2025-4-15'];

const holder = document.querySelector('.iframes');

blogs.forEach(blog => {
    let div = document.createElement('div');
    let iframe = document.createElement('iframe');
    iframe.src = 'blog/' + blog.replaceAll('-', '/') + '/index.html';
    iframe.addEventListener('load', () => {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        iframe.style.height = iframeDocument.documentElement.scrollHeight + 'px';
    });

    let btns = document.createElement('div');
    btns.classList.add('btns');
    btns.innerHTML = `<a href="blog/${blog.replaceAll('-', '/')}/index.html" class="btn">View</a>`;
    div.appendChild(iframe);
    div.appendChild(btns);
    holder.appendChild(div);
});