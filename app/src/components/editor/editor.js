import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../helpers/iframeLoader.js';
import DOMHelper from '../../helpers/domHelper.js';
import EditorText from '../editor-text';
import UIkit from 'uikit';
import Spinner from '../spinner';
import ConfirmModal from '../confirm-modal';
import ChooseModal from '../choose-modal';

export default function Editor() {
    let iframe;
    let virtualDom;
    const [_state, setState] = useState({ pageList: [], newPageName: '' });
    const [currentPage, setCurrentPage] = useState('index.html');
    const [_virtualDom, setVirtualDom] = useState();
    const [load, setLoad] = useState(true);

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

    function init(e, page) {
        // if (e) {
        //     e.preventDefault();
        // }
        isLoading();
        iframe = document.querySelector('iframe');
        open(page, isLoaded);
        loadPageList();
    }

    function open(page, cb) {
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
            .then(() => injectStyles())
            .then(cb);
    }

    function save(OnSuccess, OnDanger) {
        isLoading();
        const newDom = _virtualDom.cloneNode(_virtualDom);
        DOMHelper.unwrapTextNodes(newDom);
        const html = DOMHelper.serializeDOMToString(newDom);
        setLoad(true);
        axios
            .post('./api/savePage.php', { pageName: currentPage, html })
            .then(OnSuccess)
            .catch(OnDanger)
            .finally(isLoaded);
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

    const isLoading = () => {
        setLoad(true);
    };

    const isLoaded = () => {
        setLoad(false);
    };

    const modal = true;
    let spinner;

    load ? (spinner = <Spinner active />) : (spinner = <Spinner />);

    return (
        <>
            <iframe src={currentPage}></iframe>

            {spinner}

            <div className="panel">
                <button
                    className="uk-button uk-button-primary uk-margin-small-right"
                    uk-toggle="target: #modal-open"
                >
                    Открыть
                </button>
                <button
                    className="uk-button uk-button-primary"
                    uk-toggle="target: #modal-save"
                >
                    Опубликовать
                </button>
            </div>

            <ConfirmModal modal={modal} target={'modal-save'} method={save} />
            {/* <ChooseModal
                modal={modal}
                target={'modal-open'}
                data={pageList}
                redirect={init}
            /> */}
        </>
    );
}
