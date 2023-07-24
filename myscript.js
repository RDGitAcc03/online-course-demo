const video = document.querySelector('video');
if (video) {
    video.onended = () => {
        console.log("video has ended..");
    }
}