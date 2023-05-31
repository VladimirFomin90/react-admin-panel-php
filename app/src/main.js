import $ from 'jquery';

function getPageList() {
    $('h1').remove();
    $.get(
        './api',
        (data) => {
            data.forEach((file) => {
                $('body').append(`<h1>${file}</h1>`);
            });
        },
        'JSON',
    );
}

getPageList();

$('button').on('click', function () {
    $.post(
        './api/createNewPage.php',
        {
            name: $('input').val(),
        },
        () => {
            getPageList();
        },
    ).fail(() => {
        alert('Страница существует');
    });
});
