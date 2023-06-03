import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Editor() {
    const [_state, setState] = useState({ pageList: [], newPageName: '' });

    const _setState = (data) => setState((state) => ({ ...state, ...data }));

    useEffect(() => {
        loadPageList();
    }, [_setState.pageList]);

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

    const { pageList } = _state;
    const pages = pageList.map((page, i) => {
        return (
            <h1 key={i}>
                {page}
                <a href="#" onClick={() => deletePage(page)}>
                    (x)
                </a>
            </h1>
        );
    });

    return (
        <>
            <input
                type="text"
                onChange={(e) => _setState({ newPageName: e.target.value })}
            />
            <button onClick={createNewPage}>Создать страницу</button>
            {pages}
        </>
    );
}
