import {Component} from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';


import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {

    state ={
        char: {},
        loading: true,
        error: false
    }

    // создаем экземпляр класса, который общается с сервером, как свойство класса
    marvelService = new MarvelService();


    // первичная загрузка персонажа
    componentDidMount() {
        this.updateChar();
    }

    componentWillUnmount() {

    }

    componentDidUpdate() {

    }

    // метод используем, если пришел ответ от сервера
    // объект персонажа записываем в стэйт и используем для отображения
    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false,
            
        })
    }

    // метод для установки в состояние загрузки
    // в состоянии загрузки отображаем спиннер
    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }
    
    // метод для установки в состояние ошибки
    // выводим компонент ошибки
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    // метод обновляет персонажа, вызывается при создании комп-та, либо нажатием кнопки
    // id формируем случайно, устанавливаем стэйт загрузки, делаем запрос на сервер, устанавливаем итоговый стэйт
    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    render() {

        // в зависимости от стэйта в одну из переменных записываем компонент
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;

        return (
            <div className="randomchar">
                {/* только в одной из переменных ниже есть компонент */}
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button 
                        onClick={this.updateChar} 
                        className="button button__main">

                            <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {

    const {name, description, thumbnail, homepage, wiki} = char;

    // проверяем на наличие картинки-заглушки, делаем ее центрирование
    const notAvailableImg = thumbnail.includes("image_not_available.jpg");
    const objFitImg = notAvailableImg ? {objectFit: "contain"} : {objectFit: "cover"};


    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style = {objFitImg}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )

}

export default RandomChar;