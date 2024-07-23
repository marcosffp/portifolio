'use strict';

document.addEventListener("DOMContentLoaded", function () {
  // Element toggle function
  const elementToggleFunc = function (elem) {
    elem.classList.toggle("active");
  }

  // Sidebar variables
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");

  // Sidebar toggle functionality for mobile
  if (sidebarBtn && sidebar) {
    sidebarBtn.addEventListener("click", function () {
      elementToggleFunc(sidebar);
    });
  }

  // Navigation variables
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  // Function to handle navigation
  const handleNavClick = function (event) {
    const targetPage = event.currentTarget.getAttribute("data-nav-link");

    // Remove active class from all pages and nav links
    pages.forEach(page => page.classList.remove("active"));
    navLinks.forEach(link => link.classList.remove("active"));

    // Add active class to the target page and the clicked nav link
    const targetPageElem = document.querySelector(`[data-page="${targetPage}"]`);
    if (targetPageElem) {
      targetPageElem.classList.add("active");
    }
    event.currentTarget.classList.add("active");
  }

  // Add click event to all nav links
  navLinks.forEach(link => link.addEventListener("click", handleNavClick));

  // Testimonials variables
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");

  // Modal variable
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  // Modal toggle function
  const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  // Add click event to all modal items
  testimonialsItem.forEach(item => {
    item.addEventListener("click", function () {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
      testimonialsModalFunc();
    });
  });

  // Add click event to modal close button
  if (modalCloseBtn && overlay) {
    modalCloseBtn.addEventListener("click", testimonialsModalFunc);
    overlay.addEventListener("click", testimonialsModalFunc);
  }

  // Custom select variables
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-select-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const filterItems = document.querySelectorAll("[data-filter-item]");

  if (select) {
    select.addEventListener("click", function () { elementToggleFunc(this); });
  }

  // Function to handle filtering
  const filterFunc = function (selectedCategory) {
    filterItems.forEach(item => {
      if (selectedCategory === "all" || selectedCategory === item.dataset.category) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  // Add event to all select items
  selectItems.forEach(item => {
    item.addEventListener("click", function () {
      const selectedCategory = this.getAttribute("data-category");
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedCategory);
    });
  });

  // Add event in all filter button items for large screen
  filterBtn.forEach(btn => {
    btn.addEventListener("click", function () {
      const selectedCategory = this.getAttribute("data-category");
      selectValue.innerText = this.innerText;
      filterFunc(selectedCategory);
      filterBtn.forEach(button => button.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Initial filter
  filterFunc("all");

  // Contact form variables
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  // Add event to all form input field
  formInputs.forEach(input => {
    input.addEventListener("input", function () {
      // Check form validation
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });

  // Page navigation variables
  const navigationLinks = document.querySelectorAll("[data-nav-link]");

  // Add event to all nav link
  navigationLinks.forEach(link => {
    link.addEventListener("click", function () {
      pages.forEach((page, i) => {
        if (this.innerHTML.toLowerCase() === page.dataset.page) {
          page.classList.add("active");
          navigationLinks[i].classList.add("active");
          window.scrollTo(0, 0);
        } else {
          page.classList.remove("active");
          navigationLinks[i].classList.remove("active");
        }
      });
    });
  });
});
