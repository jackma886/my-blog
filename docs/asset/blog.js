(function () {
    const match = location.href.match(/\/(\d{4})\/(\d{1,2})\/(\d{1,2})/);

    if (match) {
        const [, year, month, day] = match;
        // 获取原始节点
        const originalNode = document.querySelector('h1');
        // 在原始节点之后插入兄弟节点
        originalNode.insertAdjacentHTML('afterend', `<div class="date">${year}年${month}月${day}日</div>`);
    }
})();