(function () {
    const match = location.href.match(/\/(\d{4})\/(\d{1,2})\/(\d{1,2})/);

    if (match) {
        const [, year, month, day] = match;
        // 获取原始节点
        const originalNode = document.querySelector('h1');
        // 在原始节点之后插入兄弟节点
        originalNode.insertAdjacentHTML('afterend', `<div class="date">${year}年${month}月${day}日</div>`);
    }

    // lightbox

    function show(e) {
        const img = e.target;
        const div = document.createElement('div');
        div.className = "mask";
        div.innerHTML = `<div class="lightbox"><img src="${img.src}" /></div>`;
        div.onclick = () => {
            if (window.self !== window.top)
                window.parent.document.body.parentNode.removeChild(div);
            else
                document.body.parentNode.removeChild(div);
        };

        if (window.self !== window.top) {
            console.log("This page is inside an iframe.");
            window.parent.document.body.parentNode.appendChild(div);
        } else {
            document.body.parentNode.appendChild(div);
        }
    }
    const imgs = document.querySelectorAll('article img');
    imgs.forEach(img => img.onclick = show);
})();