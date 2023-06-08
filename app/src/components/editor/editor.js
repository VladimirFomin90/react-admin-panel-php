import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../helpers/iframeLoader.js';
import DOMHelper from '../../helpers/domHelper.js';
import EditorText from '../editor-text';

export default function Editor() {
    let iframe;
    let virtualDom;
    const [_state, setState] = useState({ pageList: [], newPageName: '' });
    const [currentPage, setCurrentPage] = useState('index.html');
    const [_virtualDom, setVirtualDom] = useState();

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
        setCurrentPage(page);

        axios
            .get(`../${page}?rnd=${Math.random()}`)
            .then((res) => DOMHelper.parseStringToDom(res.data))
            .then(DOMHelper.wrapTextNodes)
            .then((dom) => {
                virtualDom = dom;
                setVirtualDom(virtualDom);
                return dom;
            })
            .then(DOMHelper.serializeDOMToString)
            .then((html) => axios.post('./api/saveTempPage.php', { html }))
            .then(() => iframe.load('../temp.html'))
            .then(enableEditing)
            .then(() => injectStyles());
    }

    function save() {
        const newDom = _virtualDom.cloneNode(_virtualDom);
        DOMHelper.unwrapTextNodes(newDom);
        const html = DOMHelper.serializeDOMToString(newDom);
        axios.post('./api/savePage.php', { pageName: currentPage, html });
    }

    function enableEditing() {
        iframe.contentDocument.body
            .querySelectorAll('text-editor')
            .forEach((element) => {
                const id = element.getAttribute('nodeid');
                const virtualElement = virtualDom.body.querySelector(
                    `[nodeid="${id}"]`,
                );

                new EditorText(element, virtualElement);
            });
    }

    function injectStyles() {
        const style = iframe.contentDocument.createElement('style');
        style.innerHTML = `
        text-editor:hover {
          outline: 3px solid purple;
          outline-offset: 8px;
        }
        text-editor:focus {
          outline: 3px solid red;
          outline-offset: 8px;
        }
      `;

        iframe.contentDocument.head.appendChild(style);
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
        <>
            <button onClick={save}>save</button>
            <iframe src={currentPage} frameBorder={0}></iframe>
        </>
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
