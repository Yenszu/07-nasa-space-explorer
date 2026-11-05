// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);
const getImagesBtn = document.getElementById('getImagesBtn');
const gallery = document.getElementById('gallery');

getImagesBtn.addEventListener('click', async function () {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    alert('Please select both dates.');
    return;
  }

  if (startDate > endDate) {
    alert('Start date must be before or equal to end date.');
    return;
  }

  gallery.textContent = '🔄 Loading space photos…';
  getImagesBtn.disabled = true;

  try {
    const dateFrom = startDate.slice(2).replaceAll('-', '');
const dateTo = endDate.slice(2).replaceAll('-', '');
const url = `https://science.nasa.gov/wp-json/wp/v2/apod-basic?date_from=${dateFrom}&date_to=${dateTo}`;

    const response = await fetch(url);

    if (!response.ok) {
  const errorData = await response.json();

  throw new Error(
    errorData.error?.message ||
    errorData.msg ||
    `Request failed: ${response.status}`
  );
}

    const data = await response.json();

    gallery.replaceChildren();

data.forEach(function (item) {
  if (item.media_type !== 'image') {
    return;
  }

  const card = document.createElement('div');
  card.className = 'gallery-item';

  const image = document.createElement('img');
  image.src = item.hdurl || item.url;
  image.alt = item.title;
  image.loading = 'lazy';

  const title = document.createElement('h3');
  title.textContent = item.title;

  const date = document.createElement('p');
  date.textContent = item.date;

  const detailsButton = document.createElement('button');
detailsButton.type = 'button';
detailsButton.textContent = 'View details';

function openPhotoModal() {
  document.getElementById('modalTitle').textContent = item.title;
  document.getElementById('modalDate').textContent = item.date;

  const modalImage = document.getElementById('modalImage');
  modalImage.src = image.src;
  modalImage.alt = item.title;

  const explanation = document.createElement('template');
  explanation.innerHTML = item.explanation || 'No description available.';
  document.getElementById('modalExplanation').textContent =
    explanation.content.textContent;

  document.getElementById('photoModal').showModal();
}

card.addEventListener('click', openPhotoModal);
card.append(image, title, date, detailsButton);
  gallery.appendChild(card);
});

if (gallery.children.length === 0) {
  gallery.textContent = 'No images found. Please try another date range.';
}
  } catch (error) {
    console.error(error);
    gallery.textContent = `Error: ${error.message}`;
  } finally {
    getImagesBtn.disabled = false;
  }
});
