function changeDescription(event) {
    const parent = event.target.parentNode;
    const description = parent.getElementsByClassName('descriptionContent')[0];
    const form = getForm('description', description.innerHTML, 'description');
    event.target.hidden = true;

    parent.replaceChild(form, description);

    const cancelButton = form.getElementsByClassName('cancelButton')[0];
    cancelButton.onclick = function () {
        parent.replaceChild(description, form);
        event.target.hidden = false;
    }
}

function addTable(event) {
    const description = document.getElementsByClassName('description')[0];
    event.target.hidden = true;

    const tablePattern = '<table border="1">\n<tbody>\n</tbody>\n</table>';
    const form = getForm('newTable', tablePattern, 'table');
    description.append(form);

    const cancelButton = form.getElementsByClassName('cancelButton')[0];
    cancelButton.onclick = function () {
        form.remove();
        event.target.hidden = false;
    }
}

function changeTable(event) {
    const parent = event.target.parentNode;
    const tableId = parent.dataset.tableId;
    const table = parent.getElementsByClassName('tableWrap')[0];
    const tableHtml = table.innerHTML;
    const form = getForm('changeTable', tableHtml, 'modifiedTable', tableId);

    event.target.hidden = true;
    parent.replaceChild(form, table);

    const cancelButton = form.getElementsByClassName('cancelButton')[0];
    cancelButton.onclick = function () {
        parent.replaceChild(table, form);
        event.target.hidden = false;
    }
}

async function deleteTable(event) {
    if (!confirm('Удалить?')) return;
    const parent = event.target.parentNode;
    const disciplineId = parent.dataset.disciplineId;
    const tableId =  parent.dataset.tableId;
    const req = await fetch('/admin/' + disciplineId + "?type=deleteTable&tableId=" + tableId, {
        method: 'DELETE',
        headers: {
            contentType: "application/json"
        }
    });
    let commits = await req.json();
    location.reload();
    // location.reload();
}

function getForm(type, textInArea, textAreaName, id) {
    const form = document.createElement('form');
    form.innerHTML =
        '<textarea name='+ textAreaName +'>' + textInArea.trim() + '</textarea><br>' +
        '<input type="hidden" name="type" value='+type+'>' +
        '<input type="submit" value="Ок">' +
        '<input type="button" value="Отмена" class="cancelButton">';
    form.method = 'post';

    if (id) {
        form.innerHTML += '<input type="hidden" name="id" value='+id+'>'
    }
    return form;
}