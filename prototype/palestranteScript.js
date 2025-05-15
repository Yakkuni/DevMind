let editando = null;

function abrirFormulario(palestrante = null, linha = null) {
  document.getElementById("form-modal").style.display = "flex";
  editando = linha;

  document.getElementById("palestrante-form").reset();

  if (palestrante) {
    document.getElementById("id").value = palestrante.id;
    document.getElementById("nome").value = palestrante.nome;
    document.getElementById("descricao").value = palestrante.descricao;
    document.getElementById("foto").value = palestrante.foto;
    document.getElementById("instagram").value = palestrante.redes.instagram || '';
    document.getElementById("linkedin").value = palestrante.redes.linkedin || '';
    document.getElementById("youtube").value = palestrante.redes.youtube || '';
    document.getElementById("site").value = palestrante.redes.site || '';
  }
}

function fecharFormulario() {
  document.getElementById("form-modal").style.display = "none";
  editando = null;
}

function criarCelulaRedes(redes) {
  const redesList = [];
  for (const [rede, url] of Object.entries(redes)) {
    if (url) {
      redesList.push(`<a href="${url}" target="_blank">${rede}</a>`);
    }
  }
  return redesList.join(" | ");
}

function atualizarListeners() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.onclick = function () {
      const linha = this.closest("tr");
      const palestrante = {
        id: linha.children[0].textContent,
        nome: linha.children[1].textContent,
        descricao: linha.children[2].textContent,
        foto: linha.children[3].textContent,
        redes: JSON.parse(linha.getAttribute("data-redes"))
      };
      abrirFormulario(palestrante, linha);
    };
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = function () {
      const linha = this.closest("tr");
      const nome = linha.children[1].textContent;
      if (confirm(`Excluir o palestrante ${nome}?`)) {
        linha.remove();
      }
    };
  });
}

document.getElementById("palestrante-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const palestrante = {
    id: document.getElementById("id").value,
    nome: document.getElementById("nome").value,
    descricao: document.getElementById("descricao").value,
    foto: document.getElementById("foto").value,
    redes: {
      instagram: document.getElementById("instagram").value || null,
      linkedin: document.getElementById("linkedin").value || null,
      youtube: document.getElementById("youtube").value || null,
      site: document.getElementById("site").value || null
    }
  };

  const tr = document.createElement("tr");
  tr.setAttribute("data-redes", JSON.stringify(palestrante.redes));
  tr.innerHTML = `
    <td>${palestrante.id}</td>
    <td>${palestrante.nome}</td>
    <td>${palestrante.descricao}</td>
    <td><a href="${palestrante.foto}" target="_blank">Ver Foto</a></td>
    <td>${criarCelulaRedes(palestrante.redes)}</td>
    <td class="actions">
      <button class="edit-btn">Editar</button>
      <button class="delete-btn">Excluir</button>
    </td>
  `;

  if (editando) {
    editando.replaceWith(tr);
  } else {
    document.getElementById("palestrante-list").appendChild(tr);
  }

  fecharFormulario();
  atualizarListeners();
});

atualizarListeners();
