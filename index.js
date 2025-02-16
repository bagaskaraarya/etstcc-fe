// Ngambil elemen form
const formulir = document.querySelector("form");

// // Bikin trigger event submit pada elemen form
formulir.addEventListener("submit", (e) => {
  e.preventDefault();

  // Ngambil elemen input
  const elemen_name = document.querySelector("#name");
  const elemen_email = document.querySelector("#email");
  const elemen_gender = document.querySelector("#gender");

  // Ngambil value (nim) dari elemen input
  const name = elemen_name.value;
  const email = elemen_email.value;
  const gender = elemen_gender.value;

  const id = elemen_name.dataset.id; // <- Khusus edit

  // Ngecek apakah harus POST atau PATCH
  // Kalo id kosong, jadinya POST
  if (id == "") {
    // Tambah user
    axios
      .post("http://localhost:5000/users", { name, email, gender })
      .then(() => {
        // bersihin formnya
        elemen_name.value = "";
        elemen_email.value = "";
        elemen_gender.value = "";

        // manggil fungsi get user biar datanya di-refresh
        getUser();
      })
      .catch((error) => console.log(error.message)); // <- Kalo ada error
  } else {
    axios
      .patch(`http://localhost:5000/users/${id}`, { name, email, gender })
      .then(() => {
        // bersihin formnya
        elemen_name.dataset.id = "";
        elemen_name.value = "";
        elemen_email.value = "";
        elemen_gender.value = "";

        // manggil fungsi get user biar datanya direfresh
        getUser();
      })
      .catch((error) => console.log(error)); // <- Kalo ada error
  }
});

// GET User
function getUser() {
  axios
    .get("http://localhost:5000/users")
    .then(({ data }) => {
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
    })
    .catch((error) => console.log(error.message));
}

function tampilkanUser(no, user) {
  return `
    <tr>
      <td>${no}</td>
      <td class="name">${user.name}</td>
      <td class="email">${user.email}</td>
      <td class="gender">${user.gender}</td>
      <td><button data-id=${user.id} class='btn-edit'>Edit</button></td>
      <td><button data-id=${user.id} class='btn-hapus'>Hapus</button></td>
    </tr>
  `;
}

function hapusUser() {
  const kumpulan_tombol_hapus = document.querySelectorAll(".btn-hapus");

  kumpulan_tombol_hapus.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      axios
        .delete(`http://localhost:5000/users/${id}`)
        .then(() => getUser())
        .catch((error) => console.log(error));
    });
  });
}

function editUser() {
  const kumpulan_tombol_edit = document.querySelectorAll(".btn-edit");

  kumpulan_tombol_edit.forEach((tombol_edit) => {
    tombol_edit.addEventListener("click", () => {
      // Ngambil value yg ada di form
      const id = tombol_edit.dataset.id;
      const name =
        tombol_edit.parentElement.parentElement.querySelector(
          ".name"
        ).innerText;
      const email =
        tombol_edit.parentElement.parentElement.querySelector(
          ".email"
        ).innerText;
      const gender =
        tombol_edit.parentElement.parentElement.querySelector(
          ".gender"
        ).innerText;

      // Ngambil [elemen] input
      const elemen_name = document.querySelector("#name");
      const elemen_email = document.querySelector("#email");
      const elemen_gender = document.querySelector("#gender");

      // Masukkin value yang ada di baris yang dipilih ke form
      elemen_name.dataset.id = id;
      elemen_name.value = name;
      elemen_email.value = email;
      elemen_gender.value = gender;
    });
  });
}

getUser();
