function genkey() {
    return String(
        Date.now().toString(32) +
        Math.random().toString(16)
    ).replace(/\./g, "");
}

function loadForm() {
    let alist = document.getElementsByClassName("nitro-ui-alist")[0];
    fetch("/res/res.json").then((d) => {
        d.json().then((j) => {
            Object.keys(j).forEach((a) => {
                let h = document.createElement("h2");
                let br = document.createElement("br");
                h.innerHTML = a;
                alist.appendChild(h);
                j[a].forEach((p) => {
                    let key = genkey();
                    let inp = document.createElement("input");
                    let lbl = document.createElement("label");
                    let img = document.createElement("img");
                    let div = document.createElement("div");
                    inp.setAttribute("type", "radio");
                    inp.setAttribute("name", a);
                    inp.setAttribute("id", key);
                    inp.setAttribute("value", p.name);
                    lbl.setAttribute("for", key);
                    img.setAttribute("src", p.name);
                    div.innerHTML = p.name;
                    alist.appendChild(inp);
                    alist.appendChild(lbl);
                    lbl.appendChild(img);
                    lbl.appendChild(div);
                });
                alist.appendChild(br);
            });
            alist.innerHTML += `<h2>End</h2><a style="cursor: pointer;" onclick="submit()"><img src="/res/png/arr.png" class="arr"><div>Submit Response</div></a>`;
        });
    });
}