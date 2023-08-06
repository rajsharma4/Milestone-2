// Retrieve the necessary DOM elements
const formContainer = document.getElementById('form-container');
const gridContainer = document.getElementById('grid-container');
const blogDetails = document.getElementById('blog-details');
const detailsTitle = document.getElementById('details-title');
const detailsDescription = document.getElementById('details-description');
const detailsText = document.getElementById('details-text');
const detailsImage = document.getElementById('details-image');
const addBtn = document.getElementById('add-btn');
const cutIconDetails = document.getElementById('cut-icon');
// Retrieve blogs data from localStorage on page load
const savedBlogs = localStorage.getItem('blogs');
const blogs = savedBlogs ? JSON.parse(savedBlogs) : [];

// Function to create a new blog element
function createBlogElement(blogData) {
  const blogContainer = document.createElement('div');
  blogContainer.classList.add('grid');

  // Create and append image element
  const image = document.createElement('img');
  image.src = blogData.imageUrl;
  image.alt = 'Blog Image';
  blogContainer.appendChild(image);

  // Create and append title element
  const title = document.createElement('h1');
  title.innerText = blogData.title;
  blogContainer.appendChild(title);

  // Create and append description element
  const description = document.createElement('span');
  description.innerText = blogData.description;
  blogContainer.appendChild(description);

  // Create and append text element (initially hidden)
  const text = document.createElement('p');
  text.innerText = blogData.text;
  text.style.display = 'none';
  blogContainer.appendChild(text);

  // Create and append "Read" button
  const readButton = document.createElement('button');
  readButton.innerText = 'Read';
  blogContainer.appendChild(readButton);

  // Add event listener to the "Read" button
  readButton.addEventListener('click', function () {
    showBlogDetails(blogData, blogContainer);
  });

  // Add "X" icon to delete the blog
  const deleteIcon = document.createElement('span');
  deleteIcon.innerText = 'X';
  deleteIcon.classList.add('delete-icon');
  blogContainer.appendChild(deleteIcon);

  // Add event listener to the "X" icon
  deleteIcon.addEventListener('click', function (event) {
    event.stopPropagation();
    removeBlog(blogContainer);
    handleSingleGrid(); // Call handleSingleGrid after removing a blog
  });
  return blogContainer;
}

// Function to display blog details in an overlay
function showBlogDetails(blogData, blogContainer) {
  detailsImage.src = blogData.imageUrl;
  detailsTitle.innerText = blogData.title;
  detailsDescription.innerText = blogData.description;
  detailsText.innerText = blogData.text;
  
  // Show the text content in the overlay when the "Read" button is clicked
  const text = blogContainer.querySelector('p');
  if (text) {
    text.style.display = 'block';
  }

  blogDetails.style.display = 'block';
  document.body.style.overflow = 'hidden';

  // Remove the 'active-blog' class from all blogs
  const activeBlog = gridContainer.querySelector('.active-blog');
  if (activeBlog) {
    activeBlog.classList.remove('active-blog');
    const activeBlogText = activeBlog.querySelector('p');
    if (activeBlogText) {
      activeBlogText.style.display = 'none';
    }
  }

  // Mark this blog as the active one
  blogContainer.classList.add('active-blog');
}

// Function to hide blog details overlay
function hideBlogDetails() {
  blogDetails.style.display = 'none';
  document.body.style.overflow = 'auto'; // Restore the scrolling behavior

  // Hide the text content in the grid after closing the overlay
  const activeBlog = gridContainer.querySelector('.active-blog');
  if (activeBlog) {
    const text = activeBlog.querySelector('p');
    if (text) {
      text.style.display = 'none';
    }
  }
}
// Function to handle the removal of a blog
function removeBlog(blogContainer) {
  const blogIndex = Array.from(gridContainer.children).indexOf(blogContainer);

  if (blogIndex !== -1) {
    // Remove the blog data from the 'blogs' array
    blogs.splice(blogIndex, 1);

    // Save the updated blogs array to localStorage
    localStorage.setItem('blogs', JSON.stringify(blogs));

    // Remove the grid element from the UI
    gridContainer.removeChild(blogContainer);

    // Call handleSingleGrid to update the image width for the remaining grid
    handleSingleGrid();
  }
}


// Function to handle the single grid scenario
function handleSingleGrid() {
  const gridElements = gridContainer.getElementsByClassName('grid');
  const imageElements = gridContainer.getElementsByTagName('img');

  if (gridElements.length === 1) {
    // Only one grid element is present
    const singleGrid = gridElements[0];
    const imageElement = imageElements[0];
    if (imageElement) {
      // Set the width of the image to 500px for the first grid
      imageElement.style.width = '270px';
      imageElement.style.margin = '0px';
    }
  } else if (gridElements.length > 1) {
    // Multiple grid elements are present, reset styles for all images
    for (const imageElement of imageElements) {
      imageElement.style.width = '';
      imageElement.style.margin = '';
    }
  }

  // Call toggleFormVisibility to show/hide the form based on grids
  toggleFormVisibility(false);
}

// Function to handle the single grid scenario
function handleSingleGrid() {
  const gridElements = gridContainer.getElementsByClassName('grid');
  const imageElements = gridContainer.getElementsByTagName('img');

  if (gridElements.length === 1) {
    // Only one grid element is present
    const singleGrid = gridElements[0];
    const imageElement = imageElements[0];
    if (imageElement) {
      // Set the width of the image to 500px for the first grid
      imageElement.style.width = '270px';
      imageElement.style.margin = '0px';
    }
  } else if (gridElements.length > 1) {
    // Multiple grid elements are present, reset styles for all images
    for (const imageElement of imageElements) {
      imageElement.style.width = '';
      imageElement.style.margin = '';
    }
  }
}

// Function to toggle the visibility of the form
function toggleFormVisibility(showFormAlways) {
  if (showFormAlways || gridContainer.getElementsByClassName('grid').length === 0) {
    // Show the form when there are no blogs or showFormAlways is true
    formContainer.innerHTML = `
      <span id="cut-icon-form">✂</span>
      <form>
        <input type="text" placeholder="Enter Blog Post URL">
        <input type="text" placeholder="Enter Blog Title">
        <input type="text" placeholder="Enter Blog Description">
        <textarea placeholder="Write Here" name="blog-text" cols="30" rows="10"></textarea>
        <button type="submit" id="blog-btn">Add Blog</button>
      </form>
    `;
    formContainer.style.display = 'block';
    addBtn.style.display = 'none';

    const cutIconForm = formContainer.querySelector('#cut-icon-form');
    cutIconForm.addEventListener('click', function () {
      formContainer.style.display = 'none';
      addBtn.style.display = 'block';
    });

    const blogForm = formContainer.querySelector('form');
    blogForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const imageUrl = blogForm.querySelector('input[placeholder="Enter Blog Post URL"]').value;
      const title = blogForm.querySelector('input[placeholder="Enter Blog Title"]').value;
      const description = blogForm.querySelector('input[placeholder="Enter Blog Description"]').value;
      const text = blogForm.querySelector('textarea[name="blog-text"]').value;

      const newBlog = {
        imageUrl: imageUrl,
        title: title,
        description: description,
        text: text
      };

      blogs.push(newBlog);

      // Save the updated blogs array to localStorage
      localStorage.setItem('blogs', JSON.stringify(blogs));

      const blogElement = createBlogElement(newBlog);
      gridContainer.appendChild(blogElement);

      handleSingleGrid();

      formContainer.innerHTML = '';
      formContainer.style.display = 'none';
      addBtn.style.display = 'block';
    });
  } else {
    formContainer.style.display = 'none';
    addBtn.style.display = 'block';
  }
}

// Add event listener to the "Add" button to show the form
addBtn.addEventListener('click', function () {
  toggleFormVisibility(true);
});

// Add event listener to the "X" icon in the blog details overlay to hide the overlay
cutIconDetails.addEventListener('click', function () {
  hideBlogDetails();
});

// Function to load blogs from localStorage
function loadBlogsFromLocalStorage() {
  for (const blogData of blogs) {
    const blogElement = createBlogElement(blogData);
    gridContainer.appendChild(blogElement);
  }

  // After loading blogs, check if there are any blogs to decide whether to show the form.
  toggleFormVisibility(false); // Pass false to show the form only when there are no blogs.
}

// Check if form should be shown based on grids when the page loads
toggleFormVisibility(false); // Pass false to show the form only when there are no blogs.

// Load blogs from localStorage on page load
loadBlogsFromLocalStorage();

// Call the function to handle the single grid scenario initially
handleSingleGrid();

// Add an event listener to handle window resize
window.addEventListener('resize', handleSingleGrid);