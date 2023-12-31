import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner.jsx';
import ErrorMessage from '../errorMessage/ErrorMessage.jsx';

class RandomChar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      char: {},
      loading: true,
      error: false,
    };
  }

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
    // this.timerId = setInterval(this.updateChar, 3000);
  }

  componentWillUnmount() {
    // clearInterval(this.timerId);
  }

  onCharLoaded = char => {
    this.setState({ char, loading: false });
  };

  updateChar = () => {
    this.setState({ loading: true, error: false });
    const randomId = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    this.marvelService.getCharacter(randomId).then(this.onCharLoaded).catch(this.onError);
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  render() {
    const { char, loading, error } = this.state;
    const isLoading = loading ? <Spinner /> : null;
    const isError = error ? <ErrorMessage /> : null;
    const content = !(loading || error) ? <View char={char} /> : null;
    return (
      <div className='randomchar'>
        {isLoading || isError || content}
        <div className='randomchar__static'>
          <p className='randomchar__title'>
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className='randomchar__title'>Or choose another one</p>
          <button className='button button__main' onClick={this.updateChar}>
            <div className='inner'>try it</div>
          </button>
          <img src={mjolnir} alt='mjolnir' className='randomchar__decoration' />
        </div>
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;
  let objectFit;
  if (thumbnail.includes('image_not_available')) {
    objectFit = {
      objectFit: 'contain',
    };
  }
  return (
    <div className='randomchar__block'>
      <img src={thumbnail} alt={name} className='randomchar__img' style={objectFit} />
      <div className='randomchar__info'>
        <p className='randomchar__name'>{name}</p>
        <p className='randomchar__descr'>{description}</p>
        <div className='randomchar__btns'>
          <a href={homepage} className='button button__main'>
            <div className='inner'>homepage</div>
          </a>
          <a href={wiki} className='button button__secondary'>
            <div className='inner'>Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
