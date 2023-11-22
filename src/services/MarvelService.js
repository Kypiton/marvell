export default class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = '6bf6fba19589bd5b3773e79084a5e957';

  getResource = async url => {
    try {
      let res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  getAllCharacters = async offset => {
    const res = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=${offset}&apikey=${this._apiKey}`,
    );
    return res.data.results.map(this._transformCharacter);
  };

  getCharacter = async id => {
    const res = await this.getResource(`${this._apiBase}characters/${id}?&apikey=${this._apiKey}`);
    return this._transformCharacter(res.data.results[0]);
  };

  _transformCharacter = char => {
    return {
      id: char.id,
      name: char.name.length > 22 ? `${char.name.slice(0, 22)}...` : char.name,
      description: !char.description
        ? 'There is no info about this hero.'
        : `${char.description.slice(0, 200)}...`,
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };
}
