import React, { Component, Fragment } from 'react';
import { Header, Repositories, Offline } from './styles';
import axios from 'axios';

class App extends Component {

  state = {
    newRepoInput: '',
    repositories: JSON.parse(localStorage.getItem('@Appwpa:repositories')) || [],
    online: navigator.onLine,
  }

  componentDidMount() {
    window.addEventListener('online', this.handleNetworkChange);
    window.addEventListener('offline', this.handleNetworkChange);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleNetworkChange);
    window.removeEventListener('offline', this.handleNetworkChange);
  }

  handleNetworkChange = () => {
    this.setState({ online: navigator.onLine });
  }

  addRepository =  async () => {
    if(!this.state.newRepoInput) return;

    if(!this.state.online) {
      alert('Você está offline, conecte-se para fazer essa ação!');
    }

    const response = await axios.get(
      `https://api.github.com/repos/${this.state.newRepoInput}`
    );

    this.setState({
      newRepoInput: '',
      repositories: [ ...this.state.repositories, response.data]
    });

    localStorage.setItem('@Appwpa:repositories', JSON.stringify(this.state.repositories));
  };

  render() {
    return (
      <Fragment>
        <Header>
          <input 
            placeholder="Adicionar repositório"
            onChange={ e => this.setState({ newRepoInput: e.target.value })}
            value={this.state.newRepoInput}
          />
          <button onClick={this.addRepository}>
            Adiconar
          </button>
        </Header>
        <Repositories>
          {this.state.repositories.map( repository => (
            <li key={repository.id}>
              <img src={repository.owner.avatar_url} alt="avatar"/>
              <div>
                <strong>{repository.name}</strong>
                <p>{repository.description}</p>
                <a href={repository.html_url}>Acessar</a>
              </div>
            </li>
          ))}
        </Repositories>
        { !this.state.online && <Offline>Você está offline</Offline> }        
      </Fragment>
    );
  }
}

export default App;
