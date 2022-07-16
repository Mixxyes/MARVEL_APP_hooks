class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=e5189f7d60b8a353105791207759b491';
    _baseOffset = 210;

    // общение с сервером / api, передаем url, который формируется в отд. методах
    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    // в метод передаем отступ - подобран как 210, внутри используем .getResource и ._transformCharacter
    // на выхде получаем массив с объектами персонажей
    getAllCharacters = async(offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    // в метод передаем id персонажа, внутри используем .getResource и ._transformCharacter
    // на выхде получаем объект с данными о персонаже
    getCharacter = async(id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?&${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    // метод трансформирует данные
    _transformCharacter = (char) => {
        return {
            name: (char.name.length > 22) ? `${char.name.slice(0, 22)}...` : char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            id: char.id,
            comics: char.comics.items
        }
    }
}

export default MarvelService;