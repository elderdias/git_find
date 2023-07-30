import { useState } from "react";
import { Header } from "../../components/Header";
import background from "../../assets/background.png";
import ItemList from '../../components/ItemList'
import "./styles.css"; 

function App() {
  // State para controlar o valor do input de usuário
  const [user, setUser] = useState('');

  // State para armazenar os dados do usuário atual
  const [currentUser, setCurrentUser] = useState(null);

  // State para armazenar os repositórios do usuário
  const [repos, setRepos] = useState(null);

  // Função para buscar os dados do usuário e seus repositórios
  const handleGetData = async () => {
    const userData = await fetch(`https://api.github.com/users/${user}`);
    const newUser = await userData.json();

    // Verifica se o usuário foi encontrado
    if (newUser.name) {
      const { avatar_url, name, bio, login } = newUser;
      // Atualiza o estado com os dados do usuário encontrado
      setCurrentUser({ avatar_url, name, bio, login });

      const reposData = await fetch(`https://api.github.com/users/${user}/repos`);
      const newRepos = await reposData.json();

      // Verifica se existem repositórios para o usuário
      if (newRepos.length) {
        // Atualiza o estado com os repositórios encontrados
        setRepos(newRepos);
      }
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="conteudo">
        <img src={background} className="background" alt="background app" />
        <div className="info">
          <div>
            {/* Input para inserir o nome do usuário */}
            <input
              name="usuario"
              value={user}
              onChange={event => setUser(event.target.value)}
              placeholder="@username"
            />
            {/* Botão para realizar a busca */}
            <button onClick={handleGetData}>Buscas</button>
          </div>
          {/* Verifica se há um usuário encontrado */}
          {currentUser?.name ? (
            <>
              {/* Exibe os dados do usuário encontrado */}
              <div className="perfil">
                <img src={currentUser.avatar_url} className="profile" alt="imagem de perfil" />
                <div>
                  <h3>{currentUser.name}</h3>
                  <span>@{currentUser.login}</span>
                  <p>{currentUser.bio}</p>
                </div>
              </div>
              <hr />
            </>
          ) : null}
          {/* Verifica se há repositórios para exibir */}
          {repos?.length ? (
            <div>
              <h4 className="repositorio">Repositórios</h4>
              {/* Mapeia os repositórios e exibe cada um usando o componente ItemList */}
              {repos.map(repo => (
                <ItemList key={repo.id} title={repo.name} description={repo.description} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;