import {Component} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {
    
    // offset нужен для пагинации, увеличиваем его на 9 каждый раз
    // charEnded сигнализирует, что персонажи в данных закончились и скрывает кнопку пагинации
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }
    
    // создаем экземпляр класса, который общается с сервером, как свойство класса
    marvelService = new MarvelService();

    // при создании компонента не передаем отступ, он стоит как дефолт в ф-ии общения с api
    componentDidMount() {
        this.onRequest();
    }

    // метод загружает массив из 9 персонажей
    //offset может передаваться или нет
    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    // используется в методе .onRequest для уставновки в состояние флага загрузки в true
    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    // после ответа от сервера обновляем состояние
    // в условии проверяем не закончились ли персонажи в данных
    // в массив персонажей в стэйт добавляем персонажей из нового массива персонажей
    // флаги загрузки устанавливаем в false
    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }


        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    // используется в методе onRequest для установки в состояние флага ошибки
    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }



    focusOnItem = (id) => {
        
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }
    
    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
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
                ref={this.setRef}
                key={item.id}
                onClick={() => {
                    this.focusOnItem(i);
                    this.props.onCharSelected(item.id);
                }}
                onKeyPress={(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
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
            <ul 
            className="char__grid"
            
            >
                {items}
            </ul>
        )
    }

    render() {

        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        
        // в items помещаем список с элементами списка, который формируется в методе
        const items = this.renderItems(charList);

        // в зависимости от стэйта в одну из переменных записываем компонент
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"

                    // затемняем кнопку, если идет загрузка
                    disabled={newItemLoading}

                    // отключаем показ кнопки, если закончились персонажи
                    style={{'display': charEnded ? 'none' : 'block'}}

                    // при пагинации вызываем метод .onRequest
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}


// проверяем, что в пропсы передается именно функция
// ф-я обязательна для передачи в пропсы
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;