import React from 'react';
import './ImageLinkForm.css'



const ImageLinkForm = ({onInputChange,onButtonSubmit}) => {
    return (
        <div >
            <p className='f3'>
                {'This Magic will detect faces in your pictures. Give it a try.'}
            </p>
            <div className='flex w-70 center'>
                <input className='f4 pa2 w-70 center' type='text' placeholder='Enter url here' onChange={onInputChange}/>
                <button 
                className='w-30 grow f4 link ph3 pv2 dib white'
                style={{background:'rgba(54, 110, 227,1)'}}
                onClick={onButtonSubmit}>Detect</button>
            </div>
        </div>
    )
}

export default ImageLinkForm;