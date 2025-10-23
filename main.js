class Funcionario {
  constructor(nome, idade, cargo, salario) {
    this.nome = nome;
    this.idade = idade;
    this.cargo = cargo;
    this.salario = salario;
  }

  get nome() { return this._nome; }
  get idade() { return this._idade; }
  get cargo() { return this._cargo; }
  get salario() { return this._salario; }

  set nome(valor) { this._nome = valor; }
  set idade(valor) { this._idade = valor; }
  set cargo(valor) { this._cargo = valor; }
  set salario(valor) { this._salario = valor; }
}

class FuncionarioController {
  constructor() {
    this.funcionarios = [];
    this.form = document.getElementById("idform");
    this.tabela = document.getElementById("idlinhas");
    this.editIndex = -1;

    // Elementos da busca
    this.campoBuscaNome = document.getElementById("idbuscaNome");
    this.campoBuscaIndex = document.getElementById("idbuscaIndex");
    this.btnBuscaNome = document.getElementById("btnBuscaNome");
    this.btnBuscaIndex = document.getElementById("btnBuscaIndex");
    this.resultadoBusca = document.getElementById("resultadoBusca");

    // Elementos relatórios
    this.btnRelSalario = document.getElementById("btnRelSalario");
    this.btnRelMedia = document.getElementById("btnRelMedia");
    this.btnRelCargos = document.getElementById("btnRelCargos");
    this.btnRelNomes = document.getElementById("btnRelNomes");
    this.relatorioDiv = document.getElementById("relatoriosResultado");

    this.init();
  }

  init = () => {
    this.form.addEventListener("submit", (e) => this.adicionarFuncionario(e));
    this.btnBuscaNome.addEventListener("click", () => this.buscarPorNome());
    this.btnBuscaIndex.addEventListener("click", () => this.buscarPorIndice());

    // Relatórios
    this.btnRelSalario.addEventListener("click", () => this.relatorioSalario());
    this.btnRelMedia.addEventListener("click", () => this.relatorioMedia());
    this.btnRelCargos.addEventListener("click", () => this.relatorioCargos());
    this.btnRelNomes.addEventListener("click", () => this.relatorioNomes());
  };

  adicionarFuncionario = (e) => {
    e.preventDefault();
    const nome = document.getElementById("idnome").value.trim();
    const idade = parseInt(document.getElementById("ididade").value);
    const cargo = document.getElementById("idcargo").value.trim();
    const salario = parseFloat(document.getElementById("idsalario").value);

    if (!nome || isNaN(idade) || idade <= 0 || !cargo || isNaN(salario) || salario < 0) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    const funcionario = new Funcionario(nome, idade, cargo, salario);

    if (this.editIndex === -1) {
      this.funcionarios.push(funcionario);
    } else {
      this.funcionarios[this.editIndex] = funcionario;
      this.editIndex = -1;
    }

    this.atualizarTabela();
    this.form.reset();
  };

 atualizarTabela = () => {
    this.tabela.innerHTML = "";
    this.funcionarios.forEach((f, index) => {
        const row = this.tabela.insertRow();
        row.insertCell(0).innerText = f.nome;
        row.insertCell(1).innerText = f.idade;
        row.insertCell(2).innerText = f.cargo;
        row.insertCell(3).innerText = f.salario.toFixed(2);

        const cellAcoes = row.insertCell(4);
        cellAcoes.classList.add("d-flex", "justify-content-center", "gap-2");

        // Botão Editar com ícone
        const btnEditar = document.createElement("button");
        btnEditar.className = "btn btn-sm btn-warning";
        btnEditar.innerHTML = `<i class="bi bi-pencil"></i>`;
        btnEditar.innerText = "Editar";
        btnEditar.addEventListener("click", () => this.editarFuncionario(index));

        // Botão Excluir com ícone
        const btnExcluir = document.createElement("button");
        btnExcluir.className = "btn btn-sm btn-danger";
        btnExcluir.innerHTML = `<i class="bi bi-trash"></i>`;
        btnExcluir.innerText = "Excluir";
        btnExcluir.addEventListener("click", () => this.removerFuncionario(index));

        cellAcoes.appendChild(btnEditar);
        cellAcoes.appendChild(btnExcluir);
    });
};

  removerFuncionario = (index) => {
    this.funcionarios.splice(index, 1);
    this.atualizarTabela();
  };

  editarFuncionario = (index) => {
    const f = this.funcionarios[index];
    document.getElementById("idnome").value = f.nome;
    document.getElementById("ididade").value = f.idade;
    document.getElementById("idcargo").value = f.cargo;
    document.getElementById("idsalario").value = f.salario;
    this.editIndex = index;
  };

  buscarPorNome = () => {
    const termo = this.campoBuscaNome.value.trim().toLowerCase();
    if (!termo) { this.resultadoBusca.innerText = "Digite um nome."; return; }

    const funcionario = this.funcionarios.find(f => f.nome.toLowerCase() === termo);
    this.resultadoBusca.innerText = funcionario
      ? `✅ Funcionário encontrado: ${funcionario.nome} | Cargo: ${funcionario.cargo} | Salário: R$ ${funcionario.salario.toFixed(2)}`
      : "❌ Funcionário não encontrado.";
  };

  buscarPorIndice = () => {
    const index = parseInt(this.campoBuscaIndex.value);
    if (isNaN(index) || index < 0 || index >= this.funcionarios.length) {
      this.resultadoBusca.innerText = "❌ Índice inválido ou funcionário não encontrado.";
      return;
    }
    const f = this.funcionarios[index];
    this.resultadoBusca.innerText =
      `✅ Funcionário encontrado: ${f.nome} | Cargo: ${f.cargo} | Salário: R$ ${f.salario.toFixed(2)}`;
  };

  // -------- RELATÓRIOS --------
  relatorioSalario = () => {
    const lista = this.funcionarios.filter(f => f.salario > 5000);
    this.relatorioDiv.innerHTML = `<strong>Funcionários com salário > R$ 5000:</strong><br>` +
      (lista.map(f => `${f.nome} | R$ ${f.salario.toFixed(2)}`).join("<br>") || "Nenhum funcionário");
  };

  relatorioMedia = () => {
    if (this.funcionarios.length === 0) { this.relatorioDiv.innerText = "Nenhum funcionário cadastrado."; return; }
    const media = this.funcionarios.reduce((acc, f) => acc + f.salario, 0) / this.funcionarios.length;
    this.relatorioDiv.innerText = `Média salarial dos funcionários: R$ ${media.toFixed(2)}`;
  };

  relatorioCargos = () => {
    const cargosUnicos = [...new Set(this.funcionarios.map(f => f.cargo))];
    this.relatorioDiv.innerHTML = `<strong>Cargos únicos:</strong><br>` + (cargosUnicos.join("<br>") || "Nenhum cargo");
  };

  relatorioNomes = () => {
    const nomesMaiusculos = this.funcionarios.map(f => f.nome.toUpperCase());
    this.relatorioDiv.innerHTML = `<strong>Nomes em maiúsculo:</strong><br>` + (nomesMaiusculos.join("<br>") || "Nenhum funcionário");
  };
}

document.addEventListener("DOMContentLoaded", () => new FuncionarioController());
