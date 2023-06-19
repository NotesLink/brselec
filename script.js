const apiURL = "https://brselecapi.onrender.com";
let json;

function genkey() {
    return Math.floor(
        Math.random() *
        Math.floor(Math.random() *
            Date.now()
        )).toString(32);
}

function loadForm() {
    let alist = document.getElementsByClassName("nitro-ui-alist")[0];
    fetch("/res/res.json").then((d) => {
        d.json().then((j) => {
            json = j;
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
                    img.setAttribute("src", p.icon);
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

function submit() {
    if (confirm("Are you sure you want to submit?")) {
        let fail;
        let obj = {};
        let arr = [];
        Array.from(document.querySelectorAll("input:checked")).forEach((i) => {
            obj[i.name] = i.value;
        });
        Object.keys(json).forEach((k) => {
            if (!obj[k]) {
                fail = true;
                arr.push(k);
            };
        });
        if (!fail) {
            fetch(`${apiURL}/vote/${prompt("Enter passkey:")}`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            }).then((res) => {
                if (res.ok) {
                    alert("Response Submitted successfully!\n[Method: POST]");
                    window.location.reload();
                } else {
                    res.text().then((t) => {
                        alert(`Error ${res.status} ${t}`);
                    });
                }
            });
        } else {
            alert(`Select valid values for the following fields:\n${arr.join("\n")}\n`);
        }
    }
}