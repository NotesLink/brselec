const apiURL = "https://brselecapi.onrender.com";
let json = {};

function dl(name, data) {
    let blb = new Blob([data], { type: 'json/plain' });
    let a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blb);
    a.download = name;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function dlkeys() {
    fetch(`${apiURL}/getkeys/${prompt("Passcode?:")}`, {
        method: "GET",
        mode: "cors"
    }).then((d) => {
        d.json().then((j) => {
            let arr = [];
            j.forEach((k) => {
                arr.push(k.key);
            });
            if (confirm("Download keys?")) {
                dl("keys.csv", arr.join("\n"));
            }
        });
    });
}

function showkeys() {
    fetch(`${apiURL}/getkeys/${prompt("Passcode?:")}`, {
        method: "GET",
        mode: "cors"
    }).then((d) => {
        d.json().then((j) => {
            let arr = [];
            j.forEach((k) => {
                arr.push(k.key);
            });
            console.log(arr);
            console.log(arr.join("<br>"));
            document.getElementById("key-list").innerHTML = !arr.join("<br>") ? document.getElementById("key-list").innerHTML : arr.join("<br>");
        });
    });
}

function newkey() {
    let n = prompt("Enter number of keys to generate:");
    if (confirm(`Generate ${n} new key(s)?`)) {
        fetch(`${apiURL}/newkey/${prompt("Passcode?:")}?n=${n}`, {
            method: "GET",
            mode: "cors"
        }).then((d) => {
            d.json().then((j) => {
                alert(j.replace(/\<br\>/g, "\n"));
                document.getElementById("key-list").innerHTML = j;
            });
        });
    }
}

function delkey() {
    let k = prompt("Enter key to delete:");
    if (confirm(`Delete ${k} ?`)) {
        fetch(`${apiURL}/delkey/${prompt("Passcode?:")}/${k}`, {
            method: "GET",
            mode: "cors"
        }).then((d) => {
            d.json().then((j) => {
                alert(j);
            });
        });
    }
}

function clearkeys() {
    if (confirm("Are you sure you want to delete all access keys?") && confirm("Are you really sure?")) {
        fetch(`${apiURL}/clearkeys/${prompt("Passcode?:")}`, {
            method: "GET",
            mode: "cors"
        }).then((d) => {
            d.text().then((j) => {
                alert(j);
            });
        });
    }
}

function clearvotes() {
    if (confirm("Are you sure you want to delete all votes from database?") && confirm("Are you really sure?") && confirm("Are you really, extremely sure that you want to delete all votes?")) {
        fetch(`${apiURL}/clearvotes/${prompt("Passcode?:")}`, {
            method: "GET",
            mode: "cors"
        }).then((d) => {
            d.text().then((j) => {
                alert(j);
            });
        });
    }
}

function resadd(obj) {
    console.log(obj);
}

function resprompt(opt) {
    let obj = {};
    obj.name = prompt("Enter participant name:");
    if (!obj.name) { return; }
    obj.post = prompt("Enter participant post:");
    if (!obj.post) { return; }
    switch (opt) {
        case "link":
            obj.icon = prompt("Enter image url:");
            if (!obj.icon) { return; };
            resadd(obj);
            break;
        case "file":
            let reader = new FileReader;
            reader.onload = () => {
                obj.icon = reader.result;
                resadd(obj);
            }
            reader.readAsDataURL(document.getElementById('lolxd').files[0]);
            break;
        default:
            break;
    }
}

function resdel(x) {
    fetch(`${apiURL}/resdel/${prompt("Enter passkey:")}`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(x)
    }).then((res) => {
        if (res.ok) {
            alert("Deleted successfully.")
        } else {
            res.text().then((o) => {
                alert(o);
            });
        }
        list_res();
        return null;
    }).catch((err) => {
        alert(err);
    })
}

function list_res() {
    let alist = document.getElementById("cmn3");
    fetch(`${apiURL}/list-res`).then(async (d) => {
        alist.innerHTML = null;
        d.json().then((j) => {
            json = {};
            j.forEach((a) => {
                if (!json[a.post]) {
                    json[a.post] = [];
                }
                json[a.post].push(a);
            });
            if (!(j.length > 0)) {
                alist.innerHTML = "No participants to show...";
            }
        }).then(() => {
            Object.keys(json).forEach((a) => {
                let h = document.createElement("h2");
                let br = document.createElement("br");
                h.innerHTML = a;
                alist.appendChild(h);
                json[a].forEach((p) => {
                    let a = document.createElement("a");
                    let img = document.createElement("img");
                    let div = document.createElement("div");
                    let btn = document.createElement("div");
                    img.setAttribute("src", p.icon);
                    div.innerHTML = `Name: ${p.name}<br>House: ${p.house}`;
                    div.classList.add("xd");
                    btn.innerHTML = "&#9881;";
                    btn.setAttribute("brs-name", p.name);
                    btn.setAttribute("res-str", JSON.stringify(p));
                    btn.addEventListener("click", (e) => {
                        let x = JSON.parse(e.target.getAttribute("res-str"));
                        str = new String;
                        Object.keys(x).forEach((k) => {
                            if (!(k == "icon")) {
                                str += `${k}: ${x[k]}\n`;
                            }
                        });
                        switch (prompt(`${str}\nSpecify an operation:\ndelete`, "delete")) {
                            case "delete":
                                resdel(x);
                                break;
                            default:
                                alert("Operation cancelled by user.");
                                break;
                        };
                    });
                    btn.classList.add("btn");
                    a.appendChild(img);
                    a.appendChild(div);
                    a.appendChild(btn);
                    alist.appendChild(a);
                });
                alist.appendChild(br);
            });
        });
    }).catch((err) => {
        alert(err);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetch(`${apiURL}/ping/`);
    list_res();
});