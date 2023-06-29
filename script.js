const apiURL = "https://brselecapi.onrender.com";
let json = {};

function genkey() {
    return Math.floor(
        Math.random() *
        Math.floor(Math.random() *
            Date.now()
        )).toString(32);
}

function loadForm(url) {
    let alink = document.getElementById('submit-h');
    let alist = alink.parentNode;
    fetch(url).then(async (d) => {
        d.json().then((j) => {
            let tmp = {};
            j.forEach((a) => {
                if (!(json[a.post] && tmp[a.post])) {
                    json[a.post] = [];
                    tmp[a.post] = [];
                }
                json[a.post].push({
                    name: a.name,
                    icon: a.icon
                });
                tmp[a.post].push({
                    name: a.name,
                    icon: a.icon
                });
            });
            return tmp;
        }).then((x) => {
            Object.keys(x).forEach((a) => {
                let h = document.createElement("h2");
                let br = document.createElement("br");
                h.innerHTML = a;
                alist.insertBefore(h, alink);
                x[a].forEach((p) => {
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
                    alist.insertBefore(inp, alink);
                    alist.insertBefore(lbl, alink);
                    lbl.appendChild(img);
                    lbl.appendChild(div);
                });
                alist.insertBefore(br, alink);
            });
        });
    }).catch((err) => {
        alert(err);
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
                    alert("Response Submitted successfully!\nClick \"OK\" ONLY if you have not yet voted.");
                    window.location.reload();
                } else {
                    res.tejsont().then((t) => {
                        alert(`Error ${res.status} ${t}`);
                    });
                }
            });
        } else {
            alert(`Select valid values for the following fields:\n${arr.join("\n")}\n`);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadForm(`${apiURL}/res/common`); // fetch("api/res/:house")
    do {
        window.house = prompt("Please enter your house:\n\nyellow or orange or blue or green");
    } while (((arg) => {
        if (["blue", "green", "orange", "yellow"].includes(arg.toLowerCase())) {
            loadForm(`${apiURL}/res/${arg}`);
            return false;
        } else {
            alert("Enter Valid House");
            return true;
        }
    })(house));
});