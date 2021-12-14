const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');
const textarea = form.querySelector('textarea');
const btn = form.querySelector('button');

const handleSubmit = (event) => {
    event.preventDefault();
    console.log(videoContainer.dataset);
    const text = textarea.value;
};

btn.addEventListener('click', handleSubmit);
