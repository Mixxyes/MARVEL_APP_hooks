import {useState} from 'react';
import {Link} from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charSearchForm.scss';

const CharSearchForm = () => {

    const [char, setChar] = useState(null);

    const {loading, error, getCharacterByName, clearError} = useMarvelService();

    const updateChar = ({charName}) => {
        console.log(charName);
        clearError();
        getCharacterByName(charName)
            .then(onCharLoaded)    
    }

    const onCharLoaded = (char) => {
        console.log(char);
        setChar(char);
    }

    const errorMessage = error ? 
        <div className='char__search-critical-error'><ErrorMessage/></div> : null;
    
    const results = !char ? null : char.length > 0 ?
                    <div className='char__search-wrapper'>
                        <div className="char__search-success">There is! Visit {char[0].name} page?</div>
                         <Link to={`/characters/${char[0].id}`}>
                            <div className="inner">To page</div>
                         </Link>
                    </div> :
                    <div className="char__search-error">
                        The character was not found. Check the name and try again
                    </div>;

    return (
        <div className="char__search-form">
            <Formik
                initialValues={{
                    charName: '',
                }}
                validationSchema={Yup.object({
                    charName: Yup.string().required('This field is requared!')
                })}
                onSubmit={updateChar}
            >
                <Form>
                    <label htmlFor="charName" className="char__search-label">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field 
                            id="charName"
                            type="text"
                            name="charName"
                            placeholder="Enter name"
                        />

                        <button 
                            type="submit"
                            className="button button__main"
                            disabled={loading}>
                                <div className="inner">find</div>
                        </button>
                    </div>
                    <FormikErrorMessage name="charName" component="div" className="char__search-error" />
                </Form>  
            </Formik>
            {results}
            {errorMessage}
        </div>
    )
}

export default CharSearchForm;