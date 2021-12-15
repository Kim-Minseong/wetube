const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');
const delBtns = document.querySelectorAll('.video__comments button');

const handleDeleteComment = async (event) => {
    const target = event.target.parentElement;
    target.remove();
    const { id } = target.dataset;
    await fetch(`/api/comments/${id}/delete`, {
        method: 'DELETE',
    });
};

const addComment = (text, id) => {
    const videoComments = document.querySelector('.video__comments ul');
    const newComment = document.createElement('li');
    const span = document.createElement('span');
    const delBtn = document.createElement('button');
    span.innerText = text;
    delBtn.innerText = 'delete';
    newComment.classList.add(id);
    newComment.appendChild(span);
    newComment.appendChild(delBtn);
    videoComments.prepend(newComment);
    videoComments.addEventListener('click', handleDeleteComment);
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const input = form.querySelector('input');
    const text = input.value;
    const videoId = videoContainer.dataset.id;
    if (text === '') {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text,
        }),
    });
    input.value = '';
    const json = await response.json();
    if (response.status === 201) {
        addComment(text, json.newCommentId);
    }
};

if (form) {
    form.addEventListener('submit', handleSubmit);
}

for (const i of delBtns) {
    i.addEventListener('click', handleDeleteComment);
}
