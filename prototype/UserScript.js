let editando = null;

function abrirFormulario(usuario = null, linha = null) {
  document.getElementById("form-modal").style.display = "flex";

  if (usuario) {
    // Edição
    document.getElementById("nome").value = usuario.nome;
    document.getElementById("email").value = usuario.email;
    document.getElementById("cargo").value = usuario.cargo;
    editando = { linha, usuario };
  } else {
    // Criação
    document.getElementById("user-form").reset();
    editando = null;
  }
}

function fecharFormulario() {
  document.getElementById("form-modal").style.display = "none";
}

function adicionarAoHistorico(usuario, acao) {
  const tbody = document.querySelector("tbody");
  const historico = document.querySelector(".main").firstElementChild.querySelector("tbody");
  const dataHora = new Date().toLocaleString("pt-BR");

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${usuario.nome}</td>
    <td>${acao}</td>
    <td>${dataHora}</td>
  `;
  historico.appendChild(row);
}

document.getElementById("user-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const cargo = document.getElementById("cargo").value;

  const usuario = { nome, email, cargo };

  if (editando) {
    const { linha } = editando;
    linha.children[0].textContent = nome;
    linha.children[1].textContent = email;
    linha.children[2].textContent = cargo;
    adicionarAoHistorico(usuario, "Editou um usuário");
  } else {
    const tbody = document.getElementById("user-list");
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${nome}</td>
      <td>${email}</td>
      <td>${cargo}</td>
      <td>Ativo</td>
      <td class="actions">
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Excluir</button>
      </td>
    `;
    tbody.appendChild(row);

    adicionarAoHistorico(usuario, "Criou um usuário");
  }

  fecharFormulario();
  atualizarListeners();
});

function atualizarListeners() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.onclick = function () {
      const linha = this.closest("tr");
      const usuario = {
        nome: linha.children[0].textContent,
        email: linha.children[1].textContent,
        cargo: linha.children[2].textContent
      };
      abrirFormulario(usuario, linha);
    };
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = function () {
      const linha = this.closest("tr");
      const nome = linha.children[0].textContent;
      const email = linha.children[1].textContent;
      const cargo = linha.children[2].textContent;

      if (confirm(`Deseja excluir o usuário ${nome}?`)) {
        linha.remove();
        adicionarAoHistorico({ nome, email, cargo }, "Excluiu um usuário");
      }
    };
  });
}

// Executar ao carregar
atualizarListeners();
