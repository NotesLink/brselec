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
    alert("Polling Guidelines");
    alert("[1 out of 5] Click on the box containing the name of your favourite participant to vote for them.");
    alert("[2 out of 5] Select one participant for each role. When you are done selecting the desired participants, recheck your responses and click the \"Submit Response\" button at the end of the page to submit your responses.");
    alert("[3 out of 5] Confirm that you want to submit the form by clicking \"OK\". Then, enter the provided passkey into the passkey prompt.");
    alert("[4 out of 5] Wait patiently until you see a success message. If you made a mistake entering the passkey, you will see an error message. In that case, you just have to click submit again and repeat the same procedure with the right paskey.");
    alert("[5 out of 5] Choose carefully because you will have only one vote. If you face any problems, you may ask for help from the teachers.");
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