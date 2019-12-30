function addDiscipline(event) {
    const target = event.target;
    const form = document.createElement('form');
    form.method = 'post';
    form.innerHTML =
        '<input type=text name=discipline>' +
        '<input type="submit" value="Ок">' +
        '<input type="button" value="Отмена" class="cancelButton">';
    event.target.before(form);
    target.hidden = true;
    const cancelButton = form.getElementsByClassName('cancelButton')[0];
    cancelButton.onclick = function () {
        form.remove();
        target.hidden = false;
    }
}

async function deleteDiscipline(event) {
    if (!confirm('Удалить дисциплину и всю информацию??')) {
        return;
    }
    const parent = event.target.parentNode;
    const disciplineId = parent.dataset.disciplineId;
    const req = await fetch('admin/' + disciplineId + "?type=discipline", {
        method: 'DELETE',
        headers: {
            contentType: "application/json"
        }
    });
    let commits = await req.json();
    location.reload();
}

function changeDiscipline(event) {
    const parent = event.target.parentNode;
    const disciplineId = parent.dataset.disciplineId;
    const disciplineName = parent.getElementsByClassName('disciplineName')[0];
    const form = document.createElement('form');
    event.target.hidden = true;
    form.method = 'post';
    form.innerHTML =
        '<input type=text name=discipline value=' + disciplineName.textContent + '>' +
        '<input type=hidden name=id value=' + disciplineId + ' >' +
        '<input type="submit" value="Ок">' +
        '<input type="button" value="Отмена" class="cancelButton">';
    parent.replaceChild(form, disciplineName);


    const cancelButton = form.getElementsByClassName('cancelButton')[0];
    cancelButton.onclick = function () {
        parent.replaceChild(disciplineName, form);
        event.target.hidden = false;
    }
}