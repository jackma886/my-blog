const blogs = ['2025-4-15', '2025-3-6', '2025-2-25', '2025-2-24', 
'2025-2-2', '2024-11-25', '2024-11-24', '2024-11-16', '2024-10-26', '2023-9-18', '2023-8-6', '2023-3-26'
, '2022-6-1', '2021-12-12', '2020-7-6', '2020-4-18'];
const holder = document.querySelector('.iframes');

// blogs.forEach(blog => {
//     let div = document.createElement('div');
//     let iframe = document.createElement('iframe');
//     iframe.src = 'blog/' + blog.replaceAll('-', '/') + '/index.html';
//     iframe.addEventListener('load', () => {
//         const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
//         iframe.style.height = iframeDocument.documentElement.scrollHeight + 'px';
//     });

//     let btns = document.createElement('div');
//     btns.classList.add('btns');
//     btns.innerHTML = `<a href="blog/${blog.replaceAll('-', '/')}/index.html" class="btn">View</a>`;
//     div.appendChild(iframe);
//     div.appendChild(btns);
//     holder.appendChild(div);
// });

// 每页显示条数
const itemsPerPage = 5;

// 获取当前页码 (从 query 参数)
const urlParams = new URLSearchParams(window.location.search);
const currentPage = parseInt(urlParams.get('page')) || 1;

// 计算总页数
const totalPages = Math.ceil(blogs.length / itemsPerPage);

// 渲染博客列表
function renderBlogList(page) {
    holder.innerHTML = '';

    // 计算当前页数据
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = blogs.slice(startIndex, endIndex);

    // 渲染
    pageItems.forEach(blog => {
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
}

// 渲染分页按钮
function renderPagination(page) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = i === page ? 'active' : '';
        button.addEventListener('click', () => {
            // 切换页码并更新 URL
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('page', i);
            window.location.href = newUrl.toString();
        });
        paginationContainer.appendChild(button);
    }
}

// 初始化页面
function init() {
    renderBlogList(currentPage);
    renderPagination(currentPage);
}

init();