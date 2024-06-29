function exportAsSVG() {
    if (!selected) return;

    const container = document.querySelector('.container');
    const characterHTML = selected.element.outerHTML;

    // Mengganti warna background menjadi transparan
    container.style.backgroundColor = "transparent";

    const svg = container.innerHTML
        .replace(/<svg[^>]+>/, `<svg xmlns="http://www.w3.org/2000/svg">`)
        .replace(/ onmousedown=".*?"/g, '');

    container.style.backgroundColor = "";

    const blob = new Blob([svg], {type: 'image/svg+xml'});
    const url = window.URL.createObjectURL(blob);

    const fileName = selected.name || 'character';
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function exportAsHTML() {
    if (!selected) return;

    // Mendapatkan kode HTML untuk karakter yang dipilih
    const characterHTML = selected.element.outerHTML;

    // Mengganti latar belakang menjadi transparan
    const html = `<div style="background-color: transparent;">${characterHTML}</div>`;

    const blob = new Blob([html], {type: 'text/html'});
    const url = window.URL.createObjectURL(blob);

    const fileName = document.getElementById('htmlFileName').value || 'character';
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
