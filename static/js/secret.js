    let commentInput = document.querySelector('.form-control')

//     commentInput.addEventListener("keyup", function (event) {
//      if (event.keyCode === 13) {
//     save_comment();
//   }
// });

    let num;

    $(document).ready(function () {
        show_text();

    });

    function reboot() {
        window.location.reload()
    }

    function show_text() {

        $.ajax({
            type: 'GET',
            url: '/user',
            data: {},
            success: function (response) {
                let rows = response['user']
                console.log(rows)
                let i = Math.floor(Math.random() * rows.length)
                let state = rows[i]['state']
                let date = rows[i]['date']
                let title = rows[i]['title']
                let write = rows[i]['write']
                let like = rows[i]['like']
                let img = rows[i]['img']
                num = rows[i]['num']

                let temp_html = ` <div class="title">
                <h1 id="title">${title}</h1>
                <div class="static">
                    <div>
                        별명 : 비공개
                    </div>
                    <div class="roww">
                        <div class="blue">${state}</div>
                        <div>${date}</div>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <img src="${img}" class="post-img-size"
                         alt="">
                </div>
                <div class="col-lg-12 body">
                    <p>
                       ${write}
                    </p>
                </div>
                <div class="buttons">
                    <button class='heart' onclick="save_like()"><i class="fa-solid fa-heart"></i></button>
                </div>
                <div class="center">
                    <div class="like">${like}</div>
                </div>
            </div>`

                $('.babe').append(temp_html)

                show_comment();
            }
        });
    }

    function show_comment() {
        $('.comment').empty()
        $.ajax({
            type: 'GET',
            url: `/comment?num_give=${num}`,
            data: {},
            success: function (response) {
                let rows = response['comments']
                for (let i = 0; i < rows.length; i++) {
                    let comment = rows[i]['comment']
                    let temp_html = `<div class="card">
                <div class="card-body">
                    <blockquote class="blockquote mb-10">
                        <div>비공개 :</div>
                        <p>${comment}</p>
                    </blockquote>
                </div>
            </div>`
                    $('.comment').append(temp_html)
                }
            }
        });
    }

    function save_like() {
         document.querySelector('.like').textContent=Number(document.querySelector('.like').textContent)+1
        console.log(document.querySelector('.like').textContent)
        $.ajax({
            type: 'POST',
            url: '/user',
            data: {like_give: Number(document.querySelector('.like').textContent), num_give: num},
            success: function (response) {
                console.log(response)
            }
        });


    }

    function save_comment() {

        $.ajax({
            type: 'POST',
            url: '/comment',
            data: {commentContent_give: commentInput.value, ID_give: '아이디입력', num_give: num},
            success: function (response) {
                commentInput.value = ''
                show_comment()
            }
        });
    }

    document.querySelector('.logout').addEventListener('click', () => {
        $.removeCookie('mytoken');
        alert('로그아웃!')
        window.location.href = '/login'
    })