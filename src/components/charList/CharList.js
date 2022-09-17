import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = (props) => {
    
    // offset нужен для пагинации, увеличиваем его на 9 каждый раз
    // charEnded сигнализирует, что персонажи в данных закончились и скрывает кнопку пагинации
    const [charList, setCharlist] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    
    // создаем экземпляр класса, который общается с сервером, как свойство класса
    const {loading, error, getAllCharacters} = useMarvelService();

    // при создании компонента не передаем отступ, он стоит как дефолт в ф-ии общения с api
    
    useEffect(() => {
        onRequest(offset, true);
    }, []);

    // метод загружает массив из 9 персонажей
    //offset может передаваться или нет
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded);
    }

    // после ответа от сервера обновляем состояние
    // в условии проверяем не закончились ли персонажи в данных
    // в массив персонажей в стэйт добавляем персонажей из нового массива персонажей
    // флаги загрузки устанавливаем в false
    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharlist(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }
    
    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            // в imgStyle подбираем стиль для картинки-заглушки
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            // ф-я преобразует массив объектов в массив элементов li
            // у каждого есть свойство key, где лежит id персонажа
            // в атрибут onClick пробрасываем метод, он приходит из компонента App и меняет в App стэйт
            // метод onCharSelected записывает в состояние комп-та App id выбранного персонажа
            return (
                <li 
                className="char__item"
                tabIndex={0}
                ref={el => itemRefs.current[i] = el}
                key={item.id}
                onClick={() => {
                    focusOnItem(i);
                    props.onCharSelected(item.id);
                }}
                onKeyPress={(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }
                }}
                >
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
  
    // в items помещаем список с элементами списка, который формируется в методе
    const items = renderItems(charList);

    // в зависимости от стэйта в одну из переменных записываем компонент
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"

                // затемняем кнопку, если идет загрузка
                disabled={newItemLoading}

                // отключаем показ кнопки, если закончились персонажи
                style={{'display': charEnded ? 'none' : 'block'}}

                // при пагинации вызываем метод .onRequest
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}


// проверяем, что в пропсы передается именно функция
// ф-я обязательна для передачи в пропсы
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;