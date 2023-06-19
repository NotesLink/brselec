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
            d.text().then((j) => {
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
            d.text().then((j) => {
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