import './charList.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charList: [],
      loading: true,
      error: false,
      offset: 210,
    };
  }

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateCharList();
  }

  onCharLoaded = charList => {
    this.setState({ charList, loading: false });
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  updateCharList = () => {
    this.marvelService
      .getAllCharacters(this.state.offset)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  loadMoreChar = async () => {
    const { offset } = this.state;
    this.setState(({ offset }) => ({ loading: true, offset: offset + 9 }));
    const newData = await this.marvelService.getAllCharacters(offset);
    this.setState(({ charList }) => ({
      charList: charList.concat(newData),
      loading: false,
    }));
  };

  render() {
    const { charList, loading, error } = this.state;
    let objectFit;
    if (charList.map(char => char.thumbnail.includes('image_not_available'))) {
      objectFit = {
        objectFit: 'fill',
      };
    }
    return (
      <div className='char__list'>
        <ul className='char__grid'>
          {error && <ErrorMessage />}
          {charList.map(({ id, ...char }) => (
            <li key={id} className='char__item' onClick={() => this.props.onCharSelected(id)}>
              <img src={char.thumbnail} alt={char.name} style={objectFit} />
              <div className='char__name'>{char.name}</div>
            </li>
          ))}
        </ul>
        {loading && <Spinner />}
        <button className='button button__main button__long' onClick={this.loadMoreChar}>
          <div className='inner'>load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
