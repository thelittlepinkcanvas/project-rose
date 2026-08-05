document.addEventListener('DOMContentLoaded', () => {
  const LOCATIONS = {
    'sunflower': {
      name: 'Sunflower District',
      content: [
        { type: 'text', text: 'The Sunflower District is the capital and most populous district of Foraville, home to approximately 40% of the nation\'s population. As the country\'s economic and industrial center, it is filled with businesses, government offices, and corporate headquarters.' },
        { type:'text', text: 'During the day, the city becomes even more crowded as commuters from neighbouring districts travel here for work.'},
        { type:'text', text: 'The district has a mild climate throughout the year, with temperatures typically ranging from 15°C to 23°C. Rainfall often brings cooler weather, causing temperatures to drop to the lower end of this range.'},
        { type: 'text', text: '<br>Total streets: 250'},
        { type: 'text', text: '<b>Landmarks:</b> <br>1. Rose detective agency <br>2. Foraville police headquarters'},
      ],
    },
    'tulip': {
      name: 'Tulip Hill',
      content: [
        { type: 'text', text: 'Located within the Lavender District, the hill was once an active mining site due to its rich minerals. However, mining operations were eventually prohibited after nearby factories caused severe pollution to the surroundings.'},
        { type: 'text', text: 'Tulip Hill was designated a National Conservation Area.Today, it attracts visitors with its rare minerals and diverse plant life.'},
        { type: 'text', text: 'The hill was named by Earl Lavinder, one of Foraville\'s founding leaders, in memory of his wife, Tulia Gardner, who loved planting tulips on the hillside.'},
      ],
    },
    'lavender': {
      name: 'Lavender District',
      content: [
        { type: 'text', text: 'The Lavender District is the largest district in Foraville by land area. Despite its vast size, its population is smaller than that of Bluebell District due to forests and mountain terrains.' },
        { type: 'text', text: 'The district is the nation\'s primary supplier of timber, minerals, and other natural resources. It is also known for plantations that thrive in cooler climates, unlike the tropical crops grown in Periwinkle\'s Farm.' },
        { type: 'text', text: 'The district has a similar cool climate like Bluebell District.' },
        { type: 'text', text: '<br>Total streets: 120'},
        { type: 'spoiler', warning: 'This section contains spoilers of Book one.', text: '<b>Landmarks:</b> <br>1. Benedict\'s home town' },
      ],
    },
    'lotus': {
      name: 'Lotus Dock',
      content: [
        { type: 'text', text: 'Lotus Dock is Foraville\'s primary port for international import and export. It is also the nation\'s main supplier of seafood.'},
        { type: 'text', text: 'The district is a popular tourist destination due to its beautiful beaches and coastal atmosphere. The region experiences warm summer weather throughout the year.'},
        { type: 'text', text: 'Fishing seasons peak between January and March and again from July to September.'},
        { type: 'text', text: '<br>Total streets: 20'},
        { type: 'spoiler', warning: 'This section contains spoilers of Book Four.', text: '<b>Landmarks:</b> <br>1. Where Reo was found<br> 2. Daisy Children\'s Home' },
      ],
    },
    'bluebell': {
      name: 'Bluebell District',
      content: [
        { type: 'text', text: 'The Bluebell District is the second most populous region in Foraville and serves as the nation\'s center for education and research.' },
        { type: 'text', text: 'In the district lies The Arboretum, an educational hub home to numerous schools, universities, and research institutes.' },
        { type: 'text', text: 'Bluebell experiences a cool climate throughout the year. Daytime temperatures rarely exceed 15°C, while nights can fall to 5°C. The eastern side of the district gradually becomes warmer.' },
        { type: 'text', text: '<br>Total streets: 200'},
        { type: 'spoiler', warning: 'This section contains spoilers of Book Three.', text: '<b>Landmarks:</b> <br>1. Chamomile Medical Institute' },
      ],
    },
    'lily': {
      name: 'Lily Ocean',
      content: [
        { type: 'text', text: 'The Lily Ocean refers to the waters within Foraville\'s territorial borders. It serves as the nation\'s seafood source, and supporting trade between countries.' },
        { type: 'text', text: 'Its coral reefs make it a popular destination for snorkeling and marine exploration. Along the west coastline, rock formations provide one of the country\'s most iconic photography spots.'},
      ],
    },
    'periwinkle': {
      name: 'Periwinkle\'s farm',
      content: [
        { type: 'text', text: 'Periwinkle\'s Farm serves as the nation\'s primary source of crops and livestock.' },
        { type: 'text', text: 'The land was first cultivated by Milton Periwinkle, one of the five founding leaders of Foraville. Over the generations, the farm is passed down in the Periwinkle family and expanded into a thriving farming village where many agricultural families continue to live and work.' },
        { type: 'text', text: 'Today, the area is also home to two agricultural processing factories owned by the Wellesley Corporation, supporting the nation\'s food production and distribution.' },
        { type: 'text', text: 'Periwinkle\'s Farm has warm, sunny, and humid weather throughout the year, providing ideal conditions for agriculture.'},
        { type: 'text', text: '<br>Total streets: 60'},
        { type: 'spoiler', warning: 'This section contains spoilers of Book Two.', text: '<b>Landmarks:</b> <br>1. Charlotte\'s home' },
      ],
    },
  };

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const location = LOCATIONS[id];

  const nameEl = document.getElementById('locationName');
  const bodyEl = document.getElementById('locationBody');
  const imageEl = document.getElementById('locationImage');

  if (!location) {
    nameEl.textContent = 'Location not found';
    bodyEl.innerHTML = '<p>We couldn\'t find that spot on the map. <a href="world-map.html" class="inline-link">Head back to the map</a>.</p>';
    return;
  }

  nameEl.textContent = location.name;
  document.title = `${location.name} — Project Rose`;

  bodyEl.innerHTML = location.content.map(block => {
    if (block.type === 'spoiler') {
      return `
        <div class="spoiler-block flagged">
          <div class="spoiler-note">
            <p>${block.warning}</p>
            <button class="btn">View</button>
          </div>
          <div class="spoiler-text">
            <p>${block.text}</p>
          </div>
        </div>`;
    }
    return `<p>${block.text}</p>`;
  }).join('');

  bodyEl.querySelectorAll('.spoiler-block .spoiler-note button').forEach(btn => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.spoiler-block');
      block.classList.remove('flagged');
      block.classList.add('revealed');
    });
  });
});