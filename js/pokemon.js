function buscaPokemon() {    
    let nomePokemon = document.getElementById('nome').value
    if (nomePokemon !==''){
    let url = `https://pokeapi.co/api/v2/pokemon/${nomePokemon}`
    fetch(url)
    .then(response => response.json())
    .then(function (data) {
            let imagem = data.sprites.back_default
            let peso = data.weight / 10
            let altura = data.height  / 10  
            document.getElementById('peso').value = peso       
            document.getElementById('altura').value = altura
            document.getElementById('fotoPokemon').src= imagem
        })
        .catch(function (error) {
            alert(`Não foi possível localizar o Pokemon ${nomePokemon}, caso tenha duvida consulte o campo Pokedex no menu de navegação`)
            document.getElementById('nome').value = ''
            document.getElementById('fotoPokemon').src= 'images/Pikachu.png'
            console.error(error)
        });
}
}

