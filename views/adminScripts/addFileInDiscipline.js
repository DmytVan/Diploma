async function deleteMaterials(event) {
    if (!confirm('Удалить?')) return;
    const parent = event.target.parentNode;
    const filename =  parent.dataset.filename;
    const id =  parent.dataset.id;
    const type = parent.dataset.type;
    console.log(filename);
    const req = await fetch('/admin/' + id + "?type=" + type + "&fileName=" + filename, {
        method: 'DELETE',
        headers: {
            contentType: "application/json"
        }
    });
    let commits = await req.json();
    location.reload();
}