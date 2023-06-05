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

    function loadPageList() {
        axios
            .get('./api')
            .then((res) => _setState({ pageList: res.data }))
            .catch(alert);
    }

    function init(page) {
        iframe = document.querySelector('iframe');
        open(page);
        loadPageList();
    }

    function open(page) {
        setCurrentPage(`../${page}`);

        const body = iframe.contentDocument.body;
        const textNodes = [];

        function recursy(element) {
            element.childNodes.forEach((node) => {
                if (
                    node.nodeName === '#text' &&
                    node.nodeValue.replace(/\s+/g, '').length > 0
                ) {
                    textNodes.push(node);
                } else {
                    recursy(node);
                }
            });
        }
        recursy(body);

        textNodes.forEach((node) => {
            const wrapper = iframe.contentDocument.createElement('text-editor');
            node.parentNode.replaceChild(wrapper, node);
            wrapper.appendChild(node);
            wrapper.contentEditable = true;
        });
    }

    function createNewPage() {
        axios
            .post('./api/createNewPage.php', { name: _state.newPageName })
            .then(loadPageList())
            .catch(() => alert('Страница такая уже существует!'))
            .catch(alert);
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
        <iframe src={`../${currentPage}`} frameBorder={0}></iframe>
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
