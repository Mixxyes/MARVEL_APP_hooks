import {useState, useEffect} from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';


import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {

    const [char, setChar] = useState(null);

    // создаем экземпляр класса, который общается с сервером, как свойство класса
    const {loading, error, getCharacter, clearError} = useMarvelService();
    

    // первичная загрузка персонажа
    useEffect(() => {
        
        updateChar();
        const timerId = setInterval(updateChar, 600000);

        return () => {
            clearInterval(timerId)
        }
    }, [])

    // метод используем, если пришел ответ от сервера
    // объект персонажа записываем в стэйт и используем для отображения
    const onCharLoaded = (char) => {
        setChar(char);
    }

    // метод обновляет персонажа, вызывается при создании комп-та, либо нажатием кнопки
    // id формируем случайно, устанавливаем стэйт загрузки, делаем запрос на сервер, устанавливаем итоговый стэйт
    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacter(id)
            .then(onCharLoaded);
            
    }



    // в зависимости от стэйта в одну из переменных записываем компонент
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;

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
                    onClick={updateChar} 
                    className="button button__main">

                        <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
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