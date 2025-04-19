let port = 5000;

document.addEventListener("DOMContentLoaded", () => {
  port = prompt(
    'Masukkan port Back-End \nPort dapat dilihat pada file index.js pada bagian "app.listen" \n\nNilai default-nya adalah 5000'
  ) || 5000;
  getUser();
});

const formulir = document.querySelector("form");

formulir.addEventListener("submit", (e) => {
  e.preventDefault();

  const elemen_name = document.querySelector("#name");
  const elemen_nim = document.querySelector("#nim");
  const elemen_kelas = document.querySelector("#kelas");

  const name = elemen_name.value;
  const nim = elemen_nim.value;
  const kelas = elemen_kelas.value;
  const id = elemen_name.dataset.id;

  if (id === "") {
    axios
      .post(`http://localhost:${port}/add-user`, { name, nim, kelas })
      .then(() => {
        elemen_name.value = "";
        elemen_nim.value = "";
        elemen_kelas.value = "";
        getUser();
      })
      .catch((error) => console.log(error.message));
  } else {
    axios
      .put(`http://localhost:${port}/edit-user/${id}`, { name, nim, kelas })
      .then(() => {
        elemen_name.dataset.id = "";
        elemen_name.value = "";
        elemen_nim.value = "";
        elemen_kelas.value = "";
        getUser();
      })
      .catch((error) => console.log(error));
  }
});

async function getUser() {
  try {
    const { data } = await axios.get(`http://localhost:${port}/users`);

    const table = document.querySelector("#table-user");
    let tampilan = "";
    let no = 1;

    for (const user of data) {
      tampilan += tampilkanUser(no, user);
      no++;
    }
    table.innerHTML = tampilan;
    hapusUser();
    editUser();
  } catch (error) {
    console.log(error.message);
  }
}

function tampilkanUser(no, user) {
  return `
    <tr>
      <td>${no}</td>
      <td class="name">${user.name}</td>
      <td class="nim">${user.nim}</td>
      <td class="kelas">${user.kelas}</td>
      <td><button data-id="${user.id}" class='btn-edit'>Edit</button></td>
      <td><button data-id="${user.id}" class='btn-hapus'>Hapus</button></td>
    </tr>
  `;
}

function hapusUser() {
  const tombolHapus = document.querySelectorAll(".btn-hapus");

  tombolHapus.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      axios
        .delete(`http://localhost:${port}/delete-user/${id}`)
        .then(() => getUser())
        .catch((error) => console.log(error));
    });
  });
}

function editUser() {
  const tombolEdit = document.querySelectorAll(".btn-edit");

  tombolEdit.forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");

      const id = btn.dataset.id;
      const name = row.querySelector(".name").innerText;
      const nim = row.querySelector(".nim").innerText;
      const kelas = row.querySelector(".kelas").innerText;

      const elemen_name = document.querySelector("#name");
      const elemen_nim = document.querySelector("#nim");
      const elemen_kelas = document.querySelector("#kelas");

      elemen_name.dataset.id = id;
      elemen_name.value = name;
      elemen_nim.value = nim;
      elemen_kelas.value = kelas;
    });
  });
}
