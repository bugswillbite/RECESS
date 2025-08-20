document.addEventListener('DOMContentLoaded', () => {
    // GIF FOLDER SORTING
    const gifSort = document.getElementById('gif-sort');
    const gifFolder = document.getElementById('gif-folder');
    const maxPerPage = 40;
    let currentPage = 1;
    let allItems = [];
    let originalOrder = [];
    let sortedItems = [];

    function renderPage(page) {
        if (!gifFolder) return;
        const start = (page - 1) * maxPerPage;
        const end = start + maxPerPage;
        const items = sortedItems.length ? sortedItems : allItems;
        gifFolder.innerHTML = '';
        items.slice(start, end).forEach(item => gifFolder.appendChild(item));
        addPaginationNav(items.length, page);
    }

    function addPaginationNav(total, page) {
        if (!gifFolder) return;
        let nav = document.getElementById('gif-pagination');
        if (!nav) {
            nav = document.createElement('div');
            nav.id = 'gif-pagination';
            nav.style.display = 'flex';
            nav.style.justifyContent = 'center';
            nav.style.margin = '24px 0 0 0';
            gifFolder.parentNode.appendChild(nav);
        }
        nav.innerHTML = '';
        const totalPages = Math.ceil(total / maxPerPage);
        if (totalPages <= 1) { nav.style.display = 'none'; return; } else { nav.style.display = 'flex'; }
        function makeBtn(label, p, disabled) {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.disabled = disabled;
            btn.style.margin = '0 4px';
			btn.style.background = 'black';
			btn.style.color = 'white';
            btn.style.fontWeight = p === page ? 'bold' : 'normal';
            btn.onclick = () => { currentPage = p; renderPage(currentPage); };
            return btn;
        }
        if (page > 1) nav.appendChild(makeBtn('Prev', page - 1, false));
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - page) <= 2) {
                nav.appendChild(makeBtn(i, i, false));
            } else if (i === page - 3 || i === page + 3) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                nav.appendChild(dots);
            }
        }
        if (page < totalPages) nav.appendChild(makeBtn('Next', page + 1, false));
    }

    function sortAndRender() {
        if (!gifSort || !gifFolder) return;
        const sortVal = gifSort.value;
        if (sortVal === 'name') {
            sortedItems = [...allItems].sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
        } else if (sortVal === 'color') {
            sortedItems = [...allItems].sort((a, b) => (a.dataset.color || '').localeCompare(b.dataset.color || ''));
        } else if (sortVal === 'type') {
            sortedItems = [...allItems].sort((a, b) => (a.dataset.type || '').localeCompare(b.dataset.type || ''));
        } else {
            sortedItems = [];
        }
        currentPage = 1;
        renderPage(currentPage);
    }

    if (gifSort && gifFolder) {
        allItems = Array.from(gifFolder.querySelectorAll('.gif-item'));
        originalOrder = [...allItems];
        gifSort.addEventListener('change', sortAndRender);
        gifSort.value = 'auto';
        sortAndRender();
    }

    // Toggle info box below GIF LIBRARY title
    const gifToggle = document.getElementById('gifInfoToggle');
    const gifInfoBox = document.getElementById('gifInfoBox');
    if (gifToggle && gifInfoBox) {
        gifToggle.addEventListener('click', () => {
            const open = gifInfoBox.style.display === 'block';
            gifInfoBox.style.display = open ? 'none' : 'block';
            gifToggle.textContent = open ? '▼' : '▲';
        });
    }


    // Navigation and scroll effects
    const logoWrapper = document.querySelector('.logo-wrapper');
    const frog = document.querySelector('.frog');
    const nav = document.querySelector('.main-nav');
    const parallax = document.querySelector('.parallax-bg');
    let fixed = false;

    // Navigation section switching using data-target attribute
    const navLinks = document.querySelectorAll('.main-nav a');
    const allSections = document.querySelectorAll('.main-section');

    // Set Home as selected on load
    navLinks.forEach(link => {
        if (link.getAttribute('data-target') === 'main-home') {
            link.classList.add('selected');
        }
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Hide all sections
            allSections.forEach(section => section.style.display = 'none');
            // Show the selected section
            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
            // Update selected link styling
            navLinks.forEach(l => l.classList.remove('selected'));
            link.classList.add('selected');
        });
    });

    // Scroll effects
    window.addEventListener('scroll', () => {
        if (parallax) {
            parallax.style.backgroundPositionY = `${window.scrollY * 0.3}px`;
        }
        
        if (window.scrollY > 70 && !fixed) {
            if (logoWrapper) logoWrapper.classList.add('logo-fixed');
            if (nav) nav.classList.add('nav-fixed');
            fixed = true;
        } else if (window.scrollY <= 70 && fixed) {
            if (logoWrapper) logoWrapper.classList.remove('logo-fixed');
            if (nav) nav.classList.remove('nav-fixed');
            fixed = false;
        }
        
        if (frog) {
            frog.style.display = window.scrollY > 70 ? 'none' : '';
        }
    });
});