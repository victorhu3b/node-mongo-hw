console.log("script connected.")

var heart_status = 0 // 0 is empty and 1 is filled.

document.getElementById("heart-button").addEventListener("click", () => {
    let heart = document.getElementById("heart-button");
    let date = document.getElementById("apod-date");
    let img = document.getElementById("apod-image");

    if (heart_status == 0) {
        heart.src = "static/heart-filled.png"
        heart_status = 1
        // TODO: update the database and mark this image as a favorite image.
        fetch("http://127.0.0.1:8080/api/save",{
            method: 'PUT',
            headers:{
            'Content-Type':'application/json'
            },
            body: JSON.stringify({img: img.src, date: date.innerText })
        })
    } else {
        heart_status = 0
        heart.src = "static/heart.png"
        // TODO: update the database and un-mark this image as a favorite image.
        fetch("http://127.0.0.1:8080/api/unsave",{
            method: 'POST',
            headers:{
            'Content-Type':'application/json'
            },
            body: JSON.stringify({img: img.src, date: date.innerText })
        })
    }
})

document.getElementById("next-button").addEventListener("click", () => {
    document.getElementById("heart-button").src = "static/heart.png";
    heart_status = 0
    // TODO: Get the image url, title, description, and date from the database using Fetch.
    // you can use let date = document.getElementById("apod-date"); to change the date.
    // d0rDMsFtrqpzIadVfmPcVRHnyvFDNIyi5apTGB1m

    let date = document.getElementById("apod-date");
    let img = document.getElementById("apod-image");
    let title = document.getElementById("apod-title");
    let desc = document.getElementById("apod-p");

    fetch("http://127.0.0.1:8080/api/apod").then( response => response.json()).then(data => {

        console.log(data);
        data = data[0];
        date.innerText = data.date;
        img.src = data.hdurl;
        desc.innerText = data.explanation;
        title.innerText = data.title;
    });
})