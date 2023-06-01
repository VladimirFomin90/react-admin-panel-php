import axios from 'axios';
import React, { useState } from 'react';

export default function Editor() {
    const [_state, setState] = useState({ pageList: [], newPageName: '' });

    loadPageList() {
        axios.get('./api').then(res => setState({pageList: res.data}))
    };


    return (
        <>
            <input type="text" />
            <button>Создать страницу</button>
        </>
    );
}
