// Navigation link active class toggle
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Sidebar toggle for mobile menu
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => nav.classList.toggle('active'));
navLinks.forEach(link => link.addEventListener('click', () => nav.classList.remove('active')));

// Force scroll to top on page load
window.addEventListener('load', () => setTimeout(() => window.scrollTo(0, 0), 50));

// FORM VALIDATION + FORMSPREE SUBMISSION + MODAL
const form = document.getElementById('contactForm');
const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const subject = document.getElementById('subject');
const message = document.getElementById('message');
const modal = document.getElementById('thankYouModal');
const modalDoneBtn = document.getElementById('modalDoneBtn');

// Close modal
modalDoneBtn.addEventListener('click', () => modal.style.display = 'none');

// Validation helpers
function setError(element, message) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}

function setSuccess(element) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
}

function clearValidationStyles() {
    document.querySelectorAll('.form-group').forEach(g => {
        g.classList.remove('error', 'success');
        const err = g.querySelector('.error');
        if (err) err.innerText = '';
    });
}

function isValidName(name) {
    return /^[A-Za-z ]{3,}$/.test(name);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
}

function isValidPhone(phone) {
    return /^[0-9]{10}$/.test(phone);
}

// Validate all fields
function validateInputs() {
    let isFormValid = true;

    const fullNameValue = fullName.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const subjectValue = subject.value.trim();
    const messageValue = message.value.trim();

    // Full Name
    if (fullNameValue === '') {
        setError(fullName, 'Full name is required');
        isFormValid = false;
    } else if (!isValidName(fullNameValue)) {
        setError(fullName, 'Name must be letters only, at least 3 characters');
        isFormValid = false;
    } else setSuccess(fullName);

    // Email
    if (emailValue === '') {
        setError(email, 'Email is required');
        isFormValid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
        isFormValid = false;
    } else setSuccess(email);

    // Phone
    if (phoneValue === '') {
        setError(phone, 'Phone number is required');
        isFormValid = false;
    } else if (!isValidPhone(phoneValue)) {
        setError(phone, 'Enter a valid 10-digit phone number');
        isFormValid = false;
    } else setSuccess(phone);

    // Subject
    if (subjectValue === '') {
        setError(subject, 'Subject cannot be empty');
        isFormValid = false;
    } else if (subjectValue.length < 20) {
        setError(subject, 'Subject must be at least 20 characters long');
        isFormValid = false;
    } else setSuccess(subject);

    // Message
    if (messageValue === '') {
        setError(message, 'Message cannot be empty');
        isFormValid = false;
    } else if (messageValue.length < 40) {
        setError(message, 'Message must be at least 40 characters long');
        isFormValid = false;
    } else setSuccess(message);

    return isFormValid;
}

// Intercept form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    // Prepare data for Formspree
    const formData = {
        fullName: fullName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim(),
    };

    try {
        const response = await fetch("https://formspree.io/f/mjkpqqeb", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            modal.style.display = 'block';
            form.reset();
            clearValidationStyles();
        } else {
            alert("Failed to send message. Please try again later.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
});