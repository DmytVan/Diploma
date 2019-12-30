function changeVideoNode(event) {
    const form = createForm();
    const parent = event.target.parentNode;
    form.innerValue(
        parent.getElementsByClassName('name')[0].textContent,
        parent.getElementsByTagName('iframe')[0].src,
        parent.getElementsByClassName('description')[0].textContent,
        parent.getElementsByTagName('iframe')[0].dataset.videoid,
    );
    parent.parentNode.replaceChild(form, parent);

    form.querySelector("input[value='Отмена']").onclick = cancelChangeVideoNode.bind(this, event, form, parent);
}

function cancelChangeVideoNode(event, form, parent) {
    form.parentNode.replaceChild(parent, form);
}

function addNewVideo(event) {
    const form = createForm();
    form.elements.id.value = 'add';
    const li = document.createElement('li');
    li.append(form);
    document.getElementsByClassName('videoList')[0].append(form);
    form.querySelector("input[value='Отмена']").onclick = function () {
        form.remove();
    }
}

async function deleteVideoNode(event) {
    if (!confirm('Удалить видео?')) return;
    const parent = event.target.parentNode;
    const videoId =  parent.getElementsByTagName('iframe')[0].dataset.videoid;
    const req = await fetch('/adminVideo/' + videoId, {
        method: 'DELETE',
        headers: {
            contentType: "application/json"
        }
    })
    let commits = await req.json();
    location.reload();
}

function createForm() {
    const form = document.createElement('form');
    form.innerHTML = '<label>Название: </label><input name="name" type="text">' +
        '<label>Адрес: </label><input name="url" type="text" required/>' +
        '<label>Описание: </label><textarea name="description"></textarea>' +
        '<input name="id" type="hidden">' +
        '<input type="submit" value="Ок"/>' +
        '<input type="button" value="Отмена" onclick="form.innerValue()"/> ';
    form.method = 'post';

    form.clearValue = function () {
        this.elements.name.value = "";
        this.elements.url.value = "";
        this.elements.id.value = "";
        this.elements.description.value = "";
    };

    form.innerValue = function (name, url, description, id) {
        this.elements.name.value = name? name : '';
        this.elements.url.value = url? url : '';
        this.elements.description.value = description? description : '';
        this.elements.id.value = id ? id : null;
    };

    return form
}

function addNewSection(event) {
    const form = document.createElement('form');
    event.target.hidden = true;
    form.method = 'post';
    const inputSection = document.createElement('input');
    inputSection.name = 'section';
    inputSection.type = 'text';
    inputSection.style.width = '80%';
    const inputSubmit = document.createElement('input');
    inputSubmit.type = 'submit';
    inputSubmit.value = 'Ок';
    const inputCancel = document.createElement('input');
    inputCancel.type = 'button';
    inputCancel.value = 'Отмена';
    form.append(inputSection);
    form.append(inputSubmit);
    form.append(inputCancel);

    inputCancel.onclick = function () {
        event.target.hidden = false;
        form.remove()
    };
    event.target.before(form);
}

async function deleteMenuSection(event) {
    if (!confirm('Удалить раздел?')) return;
    const parent = event.target.parentNode;
    const sectionId =  parent.dataset.sectionid;
    const req = await fetch('adminVideo/' + sectionId + "?type=sectionMenu", {
        method: 'DELETE',
        headers: {
            contentType: "application/json"
        }
    });
    let commits = await req.json();
    location.href = '/adminVideo';
    // location.reload();
}
