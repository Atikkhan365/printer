const listItems = document.querySelectorAll('.navigation ul li');
const indicator = document.querySelector('.indicator');

listItems.forEach((li, index) => {
    li.addEventListener('click', function() {
        listItems.forEach(item => item.classList.remove('active')); // Remove 'active' from all items
        li.classList.add('active'); // Add 'active' to the clicked item

        // Calculate indicator position
        const indicatorPosition = index * 70; // 70px is the width of each menu item
        indicator.style.transform = `translateX(${indicatorPosition}px)`; // Move indicator
    });
});




const posterURLs = [
    './img/image-1024x1024.jpg',
    './img/image-1024x1024 (1).jpg',
    './img/image-1024x1024.jpg',
    './img/image-1024x1024 (1).jpg'
    // Add more URLs as needed
  ];

  function loadPosters() {
    const postersDiv = document.getElementById('posters');
    postersDiv.innerHTML = '';
    posterURLs.forEach((url, index) => {
      const posterDiv = document.createElement('div');
      posterDiv.className = 'poster';
      posterDiv.innerHTML = `
        <img src="${url}" alt="Poster" id="poster${index}">
        <div class="details" id="details${index}"></div>
        <button class="download-button" onclick="downloadPoster(${index})">Download Poster</button>
      `;
      postersDiv.appendChild(posterDiv);
    });
  }

  function customizePosters() {
    const businessName = document.getElementById('businessName').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const logoFile1 = document.getElementById('logo1').files[0];
    const logoFile2 = document.getElementById('logo2').files[0];

    if (!logoFile1 || !logoFile2) {
      alert('Please fill in all fields and select both logos.');
      return;
    }

    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = function (e) {
      const logoUrl1 = e.target.result;

      reader2.onload = function (e) {
        const logoUrl2 = e.target.result;

        const posters = document.querySelectorAll('.poster');
        posters.forEach((poster, index) => {
          const detailsDiv = poster.querySelector('.details');
          detailsDiv.innerHTML = `
            <img src="${logoUrl1}" alt="Logo 1" style="width: 94px; height: auto;  margin-bottom: 219px; margin-left: 93px;">
            <img src="${logoUrl2}" alt="Logo 2" style=" width: 300px; height: auto;"><br>
            <strong>${businessName}</strong><br>
            ${contactNumber}
          `;
          detailsDiv.dataset.logoUrl1 = logoUrl1;
          detailsDiv.dataset.logoUrl2 = logoUrl2;
          detailsDiv.dataset.businessName = businessName;
          detailsDiv.dataset.contactNumber = contactNumber;
        });
      };
      reader2.readAsDataURL(logoFile2);
    };
    reader1.readAsDataURL(logoFile1);
  }

  function downloadPoster(index) {
    createPosterCanvas(index);
  }

  function downloadAllPosters() {
    const posterCount = document.querySelectorAll('.poster').length;
    for (let i = 0; i < posterCount; i++) {
      createPosterCanvas(i);
    }
  }

  function createPosterCanvas(index) {
    const posterImg = document.getElementById(`poster${index}`);
    const detailsDiv = document.getElementById(`details${index}`);

    const logoUrl1 = detailsDiv.dataset.logoUrl1;
    const logoUrl2 = detailsDiv.dataset.logoUrl2;
    const businessName = detailsDiv.dataset.businessName;
    const contactNumber = detailsDiv.dataset.contactNumber;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = posterImg.src;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      // Draw first logo
      if (logoUrl1) {
        const logoImg1 = new Image();
        logoImg1.src = logoUrl1;
        logoImg1.onload = () => {
          context.drawImage(logoImg1, 350, canvas.height - 1000, 300, 100);

          // Draw second logo
          if (logoUrl2) {
            const logoImg2 = new Image();
            logoImg2.src = logoUrl2;
            logoImg2.onload = () => {
              context.drawImage(logoImg2, 0, canvas.height - 50, 1050, 50);

              // Add text
              context.fillStyle = 'white';
              context.font = '20px Arial';
              context.fillText(businessName, 20, canvas.height - 20);
              context.fillText(contactNumber, 20, canvas.height - 50);

              // Trigger download
              const link = document.createElement('a');
              link.href = canvas.toDataURL('image/png');
              link.download = `customized_poster${index + 1}.png`;
              link.click();
            };
          }
        };
      }
    };
  }

  window.onload = loadPosters;
