let parent = document.querySelector(".parent");
let API = "http://localhost:3000/data";

let modal = document.querySelector(".dialog");
let inp1 = document.querySelector(".inp1");
let inp2 = document.querySelector(".inp2");
let Save = document.querySelector(".save");
let cancel = document.querySelector(".cancel");
let btnAdd = document.querySelector(".btnAdd");
let checkbox = document.querySelector(".checkbox");
let filter = document.querySelector("#status");
let Searchbtn = document.querySelector(".bntsearch");
let inpSearch = document.querySelector(".inpsearch");
let close = document.querySelector(".close");


close.onclick = ()=>{
  modal.close()
}

Searchbtn.onclick = async () => {
  let search = inpSearch.value.trim();
  try {
    let response = await fetch(`${API}?title=${search}`);
    let data = await response.json();
    getData(data);
  } catch (error) {}
};

// filter
filter.onclick = async () => {
  if (filter.value === "true") {
    try {
      let response = await fetch(`${API}?status=${true}`);
      let data = await response.json();
      getData(data);
    } catch (error) {
      console.log(error);
    }
  } else if (filter.value === "false") {
    try {
      let response = await fetch(`${API}?status=${false}`);
      let data = await response.json();
      getData(data);
    } catch (error) {
      console.log(error);
    }
  } else if (filter.value === "All") {
    get();
  }
};

// hide done tasks
let checked = false;
checkbox.checked = checked;
checkbox.onclick = () => {
  if (!checked) {
    hideDoneTasks();
    checked = !checked;
  } else {
    get();
    checked = !checked;
  }
};

async function hideDoneTasks() {
  try {
    let response = await fetch(`${API}?status=${true}`);
    let data = await response.json();
    getData(data);
  } catch (error) {
    console.log(error);
  }
}

// get
async function get() {
  try {
    let response = await fetch(API);
    let data = await response.json();
    getData(data);
  } catch (error) {}
}

// delete
async function deletetask(id) {
  try {
    let response = await fetch(`${API}/${id}`, { method: "DELETE" });
    get();
  } catch (error) {
    console.log(error);
  }
}

//open modal
let idx = null;
function openModal(e) {
  idx = e;
  modal.showModal();
  inp1.value = e.title;
  inp2.value = e.describtion;
}

// edit and +add
Save.onclick = async () => {
  if (Save.innerHTML === "SAVE") {
    let response = await fetch(`${API}/${idx.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: inp1.value,
        describtion: inp2.value,
      }),
    });
    get();
    inp1.value = "";
    inp2.value = "";
    modal.close();
  } else if (Save.innerHTML ==="ADD") {
    // console.log("hi");
    let response = await fetch(`${API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: inp1.value,
        describtion: inp2.value,
      }),
    });
    get();
    Save.innerHTML ="SAVE";
    inp1.value = "";
    inp2.value = "";
    modal.close();
  }
};

//cancel
cancel.onclick = () => {
  inp1.value = "";
  inp2.value = "";
  Save.innerHTML ="SAVE";
  modal.close();
};

btnAdd.onclick = () => {
  Save.innerHTML = "ADD";
  openModal();
};

async function chek(e) {
  try {
    let response = await fetch(`${API}/${e.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...e,
        status: !e.status,
      }),
    });
    get();
  } catch (error) {
    console.log(error);
  }
}

function getData(data) {
  parent.innerHTML = "";
  data.forEach((e) => {
    let div = document.createElement("div");
    div.className = "div";
    let Title = document.createElement("h1");
    Title.innerHTML = e.title;
    Title.style.textDecoration = e.status ? "" : "line-through";
    let Desctibtion = document.createElement("p");
    Desctibtion.innerHTML = e.describtion;
    let divall = document.createElement("div");
    divall.style.width = "100%";
    divall.style.display = "flex";
    divall.style.justifyContent = "space-between";
    divall.style.alignItems = "center";

    let div1 = document.createElement("div");
    div1.style.display = "flex";
    div1.style.gap = "15px";

    //edit
    let btnEdit = document.createElement("img");
    btnEdit.src = "./EditFilled.png";
    btnEdit.onclick = () => {
      openModal(e);
    };

    //delete
    let btnDelete = document.createElement("img");
    btnDelete.src = "./DeleteFilled.png";
    btnDelete.onclick = () => {
      deletetask(e.id);
    };

    let divstatus = document.createElement("div");
    divstatus.style.width = "25%";
    divstatus.style.padding = "2% 5%";
    divstatus.style.display = "flex";
    divstatus.style.gap = "15px";

    // status (done)
    let checked = document.createElement("input");
    checked.type = "checkbox";
    checked.style.cursor = "pointer";
    checked.checked = e.status;
    checked.onclick = () => {
      chek(e);
    };
    let Satus = document.createElement("p");
    Satus.style.color = e.status ? "green" : "red";
    Satus.style.fontWeight = "bold";
    Satus.style.fontSize = "18px";
    Satus.innerHTML = e.status ? "Active" : "Inactive";

    div1.append(btnEdit, btnDelete);
    divstatus.append(checked, Satus);
    divall.append(div1, divstatus);
    div.append(Title, Desctibtion, divall);
    parent.append(div);
  });
}

get();
