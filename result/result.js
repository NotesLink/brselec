const apiURL = "https://brselecapi.onrender.com";

function dl(name, data) {
    let blb = new Blob([data], { type: 'text/plain' });
    let a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blb);
    a.download = name;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function dlkeys() {
    let alist = document.getElementsByClassName("nitro-ui-alist")[0];
    fetch(`${apiURL}/getvotes/`, {
        method: "GET",
        mode: "cors"
    }).then((d) => {
        d.json().then((j) => {
            let obj = {};
            j.forEach((o) => {
                Object.keys(o).forEach((k) => {
                    if (!obj[k]) {
                        obj[k] = {}
                    }
                    if (!obj[k][o[k]]) {
                        obj[k][o[k]] = 0;
                    }
                    obj[k][o[k]]++;
                });
            });
            Object.keys(obj).forEach((a) => {
                let h = document.createElement("h2");
                let br = document.createElement("br");
                h.innerHTML = a;
                alist.appendChild(h);
                Object.keys(obj[a]).sort((x, y) => {
                    if (obj[a][x] > obj[a][y]) return -1;
                    if (obj[a][x] < obj[a][y]) return 1;
                    return 0;
                }).forEach((n) => {
                    let wrap = document.createElement("div");
                    let name = document.createElement("div");
                    let vote = document.createElement("div");
                    wrap.appendChild(name);
                    wrap.appendChild(vote);
                    name.innerHTML = `Name: ${n}`;
                    vote.innerHTML = `Votes: ${obj[a][n]}`;
                    alist.appendChild(wrap);
                });
                alist.appendChild(br);
            });
        });
    });
}
