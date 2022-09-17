import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import useMarvelService from '../../services/MarvelService';

import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    // создаем экземпляр класса, который общается с сервером, как свойство класса
    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId]);

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }

        clearError();
        getCharacter(charId)
            .then(onCharLoaded);
    }

    const onCharLoaded = (char) => {

        setChar(char);
    }

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div  className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>

    )

}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    const notAvailableImg = thumbnail.includes("image_not_available.jpg");
    const objFitImg = notAvailableImg ? {objectFit: "contain"} : {objectFit: "cover"};

    const comicsRender = (comics) => {
        return comics.map((item, i) => {

            return (
                
                <li key={i} className="char__comics-item">
                    {item.name}
                </li>
            )
        })
    }

    return (
        <>
            <div className="char__basics">
                    <img src={thumbnail} alt={name} style={objFitImg}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    (comics.length !== 0) ? comicsRender(comics.slice(0, 10)) : "There are no comics for this character"
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;