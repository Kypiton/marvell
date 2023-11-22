import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';
import { Component } from 'react';

class CharInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      char: null,
      loading: false,
      error: false,
    };
  }

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps) {
    if (this.props.charId !== prevProps.charId) this.updateChar();
  }

  onCharLoaded = char => {
    this.setState({ char, loading: false });
  };

  onCharLoading = () => {
    this.setState({ loading: true });
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  updateChar = () => {
    const { charId } = this.props;
    if (!charId) return;
    this.onCharLoading();
    this.marvelService.getCharacter(this.props.charId).then(this.onCharLoaded).catch(this.onError);
    // this.foo.bar = 0;
  };

  render() {
    const { char, loading, error } = this.state;
    const skeleton = char || loading || error ? null : <Skeleton />;
    const isLoading = loading ? <Spinner /> : null;
    const isError = error ? <ErrorMessage /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;
    return <div className='char__info'>{skeleton || isLoading || isError || content}</div>;
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  let objectFit;
  if (thumbnail.includes('image_not_available')) {
    objectFit = {
      objectFit: 'contain',
    };
  }
  return (
    <>
      <div className='char__basics'>
        <img src={thumbnail} alt={name} style={objectFit} />
        <div>
          <div className='char__info-name'>{name}</div>
          <div className='char__btns'>
            <a href={homepage} className='button button__main'>
              <div className='inner'>homepage</div>
            </a>
            <a href={wiki} className='button button__secondary'>
              <div className='inner'>Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className='char__descr'>{description}</div>
      <div className='char__comics'>Comics:</div>
      <ul className='char__comics-list'>
        {!comics.length && <p>There are no comics to this character.</p>}
        {comics.length >= 10
          ? comics.slice(0, 10).map((comic, index) => (
              <li key={index} className='char__comics-item'>
                <a href={comic.resourceURI}>{comic.name}</a>
              </li>
            ))
          : comics.map((comic, index) => (
              <li key={index} className='char__comics-item'>
                <a href={comic.resourceURI}>{comic.name}</a>
              </li>
            ))}
      </ul>
    </>
  );
};

export default CharInfo;
