const apiURL = "https://brselecapi.onrender.com";
let json;

function genkey() {
    return Math.floor(
        Math.random() *
        Math.floor(Math.random() *
            Date.now()
        )).toString(32);
}

function loadForm(url) {
    let alist = document.getElementsByClassName("nitro-ui-alist")[0];
    fetch(url).then((d) => {
        d.json().then((j) => {
            Object.keys(j).forEach((a) => {
                json[a] = j[a];
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
                    alert("Response Submitted successfully!\nClick \"OK\" ONLY if you have not yet voted.");
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

housetest = (arg) => {
    if (arr.includes(arg.toLowerCase())) {
        loadForm(`/res/${arg}.json`);
        return true;
    } else {
        alert("Enter Valid House");
        return false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let arr = ["blue", "green", "orange", "yellow"];
    loadForm("/res/res.json");
    do {
        window.house = prompt("Please enter your house:\n\nyellow or orange or blue or green");
    } while (housetest());
});