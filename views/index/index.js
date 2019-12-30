function setTextAnimation() {
    const logo = document.getElementsByClassName('logo')[0];
    logo.addEventListener("animationend", () => {
        const headerText = document.getElementsByClassName('headerText')[0];
        headerText.style.opacity = 1;
        setTimeout(() => {
            const headerText = document.getElementsByClassName('headerText')[1];
            headerText.style.opacity = 1;
        }, 1000)
    }, false);
    const blind1 = blind();
    setInterval(blind1, 900);
}

function blind() {
    let isChange = false;
    const container = document.getElementsByClassName('container')[0];
    return function () {
        if (isChange) {
            container.style.textShadow = '0 0 0px';
            isChange = !isChange;
        } else {
            container.style.textShadow = '0 0 30px';
            isChange = !isChange;
        }
    }
}

function changeContent() {
    let contentNow = 0;

    return function (event, index) {

        if (contentNow === index) {
            return;
        }

        const contentNowNode = document.getElementsByClassName('content')[contentNow];
        const contentNextNode = document.getElementsByClassName('content')[index];

        contentNowNode.addEventListener("animationend", function addAnimation() {
            contentNowNode.classList.add('hide');
            contentNowNode.style.position = '';
            contentNowNode.classList.remove('animationContentHide');
            contentNowNode.removeEventListener("animationend", addAnimation)
        }, false);

        contentNextNode.addEventListener("animationend", function removeAnimation() {
            contentNextNode.style.position = '';
            contentNextNode.classList.remove('animationContentSet');
            contentNextNode.removeEventListener("animationend", removeAnimation)
            contentNextNode.classList.remove('hide');
        }, false);


        contentNextNode.style.position = 'absolute';
        contentNextNode.classList.remove('hide');
        contentNextNode.classList.add('animationContentSet');

        contentNowNode.style.position = 'absolute';
        contentNowNode.classList.add('animationContentHide');

        contentNow = index
    }
}

function addEventInContent() {
    const a = Array.from(document.getElementsByTagName('a'));
    const changeContentFn = changeContent();
    for (let i = 0; i < a.length; i++) {
        a[i].onclick = function (event) {
            changeContentFn(event, i);
            event.preventDefault();
        }
    }
}

function showPhoto(event) {
    const target = event.target;
    const bigPhoto = document.getElementsByClassName('bigPhoto')[0];
    const background = document.getElementsByClassName('transparent')[0];
    background.hidden = false;
    bigPhoto.hidden = false;
    document.addEventListener('click', function closeAvatar(event) {
        if (event.target === bigPhoto || event.target === target) {
            return
        }
        background.hidden = true;
        bigPhoto.hidden = true;
        document.removeEventListener('click', closeAvatar);
    })
}

function showHeading(event, searchClass) {
    const heading = document.getElementsByClassName(searchClass)[0];
    heading.scrollIntoView();
}

function setUpBtn(elem) {
    window.addEventListener('scroll', function() {
        if (pageYOffset < 500) {
            elem.classList.add('hide');
            return;
        }
        elem.classList.remove('hide');
    });
    elem.onclick = function () {
        window.scrollTo(0,0)
    }
}

addEventInContent();
setUpBtn(document.getElementsByClassName('up')[0]);
setTextAnimation();