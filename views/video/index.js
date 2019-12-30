function setIframeHeight() {
    const iframes = document.getElementsByTagName('iframe');
    Array.from(iframes).forEach((iframe) => {
        iframe.style.height = iframe.clientWidth * 0.5625 + 'px';
    })
}

function callMenu() {
    const menu = document.getElementsByClassName('menu')[0];
    console.log(menu);
    menu.style.display = 'block';
    document.addEventListener('click', menuHidden);

    function menuHidden(event) {
        if (event.target.classList.contains('callMenu') || event.target.closest('.menu')) {
            return
        }
        menu.style.display = 'none';
        document.removeEventListener('click', menuHidden);
    }
}


setIframeHeight();