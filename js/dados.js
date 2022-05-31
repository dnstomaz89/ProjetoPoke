/**
 * obtemDados.
 * Obtem dados da collection a partir do Firebase.
 * @param {string} collection - Nome da collection no Firebase
 * @return {object} - Uma tabela com os dados obtidos
 */
function obtemDados(collection) {
  var tabela = document.getElementById('tabelaDados')

  firebase.database().ref(collection).on('value', (snapshot) => {
    tabela.innerHTML = ''
    let cabecalho = tabela.insertRow()
    cabecalho.className = 'table-success'
    cabecalho.insertCell().textContent = 'Pokémon'
    cabecalho.insertCell().textContent = 'Captura'
    cabecalho.insertCell().textContent = 'Email'
    cabecalho.insertCell().textContent = 'Sexo'
    cabecalho.insertCell().textContent = 'Peso (kl)'
    cabecalho.insertCell().textContent = 'Altura (m)'
    cabecalho.insertCell().textContent = 'Shiny'
    cabecalho.insertCell().textContent = 'Região'
    cabecalho.insertCell().innerHTML = 'Opções'
    

    snapshot.forEach(item => {
      // Dados do Firebase
      let db = item.ref.path.pieces_[0] //collection
      let id = item.ref.path.pieces_[1] //id do registro   
      let registro = JSON.parse(JSON.stringify(item.val()))
      //Criando as novas linhas na tabela
      let novaLinha = tabela.insertRow()
      novaLinha.insertCell().textContent = item.val().nome
      novaLinha.insertCell().textContent = item.val().captura
      novaLinha.insertCell().textContent = item.val().email
      novaLinha.insertCell().textContent = item.val().sexo
      novaLinha.insertCell().textContent = item.val().peso
      novaLinha.insertCell().textContent = item.val().altura
      novaLinha.insertCell().textContent = item.val().shiny
      novaLinha.insertCell().textContent = item.val().regiao
      novaLinha.insertCell().innerHTML = `<button class='btn btn-sm btn-danger' onclick=remover('${db}','${id}')>🗑 Excluir</button>
      <button class='btn btn-sm btn-info' onclick=carregaDadosAlteracao('${db}','${id}')>✏️ Editar</button>`

    })
    let rodape = tabela.insertRow()
    rodape.className = 'table-success'
    rodape.insertCell().textContent = ''
    rodape.insertCell().textContent = ''
    rodape.insertCell().textContent = ''
    rodape.insertCell().textContent = ''
    rodape.insertCell().textContent = ''
    rodape.insertCell().textContent = ''
    rodape.insertCell().textContent = ''
    rodape.insertCell().textContent = ''
    rodape.insertCell().innerHTML = totalRegistros(collection)
  })
}

/**
 * obtemDados.
 * Obtem dados da collection a partir do Firebase.
 * @param {string} db - Nome da collection no Firebase
 * @param {integer} id - Id do registro no Firebase
 * @return {object} - Os dados do registro serão vinculados aos inputs do formulário.
 */

function carregaDadosAlteracao(db, id) {
  firebase.database().ref(db).on('value', (snapshot) => {
    snapshot.forEach(item => {
      if (item.ref.path.pieces_[1] === id) {
        document.getElementById('id').value = item.ref.path.pieces_[1]
        document.getElementById('nome').value = item.val().nome
        document.getElementById('email').value = item.val().email
        document.getElementById('captura').value = item.val().captura
        document.getElementById('peso').value = item.val().peso
        document.getElementById('altura').value = item.val().altura
        document.getElementById('shiny').value = item.val().shiny
        document.getElementById('regiao').value = item.val().regiao
        if(item.val().shiny===''){ 
          document.getElementById('shiny').checked = true
        } else {
          document.getElementById('shiny').checked = false
        }
        
        if(item.val().sexo==='Masculino'){ 
          document.getElementById('sexoM').checked = true
        } else {
          document.getElementById('sexoF').checked = true
        }
      }
    })
  })
}



/**
 * incluir.
 * Inclui os dados do formulário na collection do Firebase.
 * @param {object} event - Evento do objeto clicado
 * @param {string} collection - Nome da collection no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function salvar(event, collection) {
  event.preventDefault() // evita que o formulário seja recarregado
  //Verifica os campos obrigatórios
  if (document.getElementById('nome').value === '') { alert('⚠️É obrigatório informar o nome!') }
  else if (document.getElementById('email').value === '') { alert('⚠️É obrigatório informar o email!') }
  else if (document.getElementById('captura').value === '') { alert('⚠️É obrigatório informar a captura!') }
  else if (document.getElementById('peso').value === '') { alert('⚠️É obrigatório informar o peso!') }
  else if (document.getElementById('altura').value==='') { alert('⚠️É obrigatório informar o altura!')}
  else if (document.getElementById('shiny').value==='') { alert('⚠️É obrigatório informar se o pokemon é shiny!')}
  else if (document.getElementById('regiao').value==='') { alert('⚠️É obrigatório informar a região!')}
  else if (document.getElementById('id').value !== '') { alterar(event, collection) }
  else { incluir(event, collection) }
}


function incluir(event, collection) {
  event.preventDefault()
  //Obtendo os campos do formulário
  //const form = document.forms[0];
  //const data = new FormData(form);
  //Obtendo os valores dos campos
  //const values = Object.fromEntries(data.entries());
  let nome = document.getElementById('nome').value;
  let email = document.getElementById('email').value;
  let captura = document.getElementById('captura').value;
  let peso = document.getElementById('peso').value;
  let altura = document.getElementById('altura').value;'  '
  let regiao = document.getElementById('regiao').value;

  var shiny =''
  if(document.getElementById('shiny').checked){
    shiny = 'Sim'
  } else {
    shiny = 'Não'
  }  

  var sexo =''
  if(document.getElementById('sexoM').checked){
    sexo = 'Masculino'
  } else {
    sexo = 'Feminino'
  }  
  const pokemon = {    
          'nome' : capitalizeFirstLetter(nome),
          'email' : email,
          'captura' : captura,
          'peso' : peso,    
          'altura' : altura,  
          'shiny'  : shiny,
          'regiao' : regiao,
          'sexo' : sexo
  }  
  //Enviando os dados dos campos para o Firebase
  return firebase.database().ref(collection).push(pokemon)
    .then(() => {
      alert('✅ Registro cadastrado com sucesso!')
      document.getElementById('formCadastro').reset()
    })
    .catch(error => {
      console.log(error.code)
      console.log(error.message)
      alert('❌ Falha ao incluir: ' + error.message)
    })
}

function alterar(event, collection) {
  event.preventDefault()
  //Obtendo os campos do formulário
  const form = document.forms[0];
  const data = new FormData(form);
  //Obtendo os valores dos campos
  const values = Object.fromEntries(data.entries());
  console.log(values)
  //Enviando os dados dos campos para o Firebase
  return firebase.database().ref().child(collection + '/' + values.id).update({
    nome: values.nome,
    email: values.email,
    sexo: values.sexo,
    captura: values.captura,
    peso: values.peso,
    altura: values.altura,
    shiny: values.shiny,
    regiao: values.regiao
  })
    .then(() => {
      alert('✅ Registro alterado com sucesso!')
      document.getElementById('formCadastro').reset()
    })
    .catch(error => {
      console.log(error.code)
      console.log(error.message)
      alert('❌ Falha ao alterar: ' + error.message)
    })
}

/**
 * remover.
 * Remove os dados da collection a partir do id passado.
 * @param {string} db - Nome da collection no Firebase
 * @param {integer} id - Id do registro no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */
function remover(db, id) {
  if (window.confirm("⚠️Confirma a exclusão do registro?")) {
    let dadoExclusao = firebase.database().ref().child(db + '/' + id)
    dadoExclusao.remove()
      .then(() => {
        alert('✅ Registro removido com sucesso!')
        new bootstrap.Alert('aoagai')
      })
      .catch(error => {
        console.log(error.code)
        console.log(error.message)
        alert('❌ Falha ao excluir: ' + error.message)
      })
  }
}


/**
 * totalRegistros
 * Retornar a contagem do total de registros da collection informada
 * @param {string} collection - Nome da collection no Firebase
 * @param {integer} id - Id do registro no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function totalRegistros(collection) {
  var retorno = '...'
  firebase.database().ref(collection).on('value', (snap) => {
    if (snap.numChildren() === 0) {
      retorno = '⚠️ Ainda não há nenhum registro cadastrado!'
    } else {
      retorno = `Total de Registros: <span class="badge bg-primary"> ${snap.numChildren()} </span>`
    }
  })
  return retorno
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}