import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../helpers/iframeLoader.js';

export default function Editor() {
    let iframe;
    const [_state, setState] = useState({ pageList: [], newPageName: '' });
    const [currentPage, setCurrentPage] = useState('index.html');

    const _setState = (data) => setState((state) => ({ ...state, ...data }));

    useEffect(() => {
        init(currentPage);
    }, []);

    function init(page) {
        iframe = document.getElementById('frame');
        open(page);
        loadPageList();
    }

    function open(page) {
        setCurrentPage(page);
        // iframe.load(currentPage, () => {
        //     console.log(currentPage);
        // });
    }

    function loadPageList() {
        axios.get('./api').then((res) => _setState({ pageList: res.data }));
    }

    function createNewPage() {
        axios
            .post('./api/createNewPage.php', { name: _state.newPageName })
            .then(loadPageList())
            .catch(() => alert('Страница такая уже существует!'));
    }

    function deletePage(page) {
        axios
            .post('./api/deletePage.php', { name: page })
            .then(loadPageList())
            .catch(() => alert('Страница была уже удалена!'));
    }

    // const { pageList } = _state;
    // const pages = pageList.map((page, i) => {
    //     return (
    //         <h1 key={i}>
    //             {page}
    //             <a href="#" onClick={() => deletePage(page)}>
    //                 (x)
    //             </a>
    //         </h1>
    //     );
    // });

    return (
        <iframe src={`../${currentPage}`} id="frame"></iframe>
        //     <>
        //         <input
        //             type="text"
        //             onChange={(e) => _setState({ newPageName: e.target.value })}
        //         />
        //         <button onClick={createNewPage}>Создать страницу</button>
        //         {pages}
        //     </>
    );
}
