
document.addEventListener('DOMContentLoaded', () => {
    const partsGrid = document.getElementById('parts-grid');
    const detailView = document.getElementById('detail-view');
    const detailContent = document.getElementById('detail-content');
    const closeDetailBtn = document.getElementById('close-detail');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    let exercisesData = {};

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    closeDetailBtn.addEventListener('click', () => {
        detailView.classList.add('hidden');
        document.getElementById('parts').scrollIntoView({ behavior: 'smooth' });
    });

    fetch('data/content.json')
        .then(response => response.json())
        .then(data => {
            exercisesData = data.parts;
            renderParts(data.parts);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            partsGrid.innerHTML = '<div class="col-span-full text-center text-red-500">Chyba při načítání dat.</div>';
        });

    function renderParts(parts) {
        partsGrid.innerHTML = '';
        parts.forEach(part => {
            const card = document.createElement('div');
            card.className = 'part-card bg-white p-6 rounded-xl border border-gray-100 shadow-sm cursor-pointer group hover:border-brand-blue/30 relative overflow-hidden';
            card.innerHTML = `
                <div class="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                <div class="relative z-10 flex flex-col items-center text-center">
                    <div class="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center text-brand-blue mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                        <i class="ph ${part.icon || 'ph-barbell'} text-3xl"></i>
                    </div>
                    <h3 class="font-bold text-gray-900 group-hover:text-brand-blue transition-colors">${part.name}</h3>
                </div>
            `;

            card.addEventListener('click', () => showDetail(part));
            partsGrid.appendChild(card);
        });
    }

    function showDetail(part) {
        let exercisesHtml = '';
        if (part.exercises && part.exercises.length > 0) {
            exercisesHtml = `<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">`;
            part.exercises.forEach(ex => {
                exercisesHtml += `
                    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div class="aspect-w-16 aspect-h-9 bg-white relative overflow-hidden group">
                            <img src="${ex.image}" alt="${ex.name}" class="w-full h-48 object-contain transform group-hover:scale-105 transition-transform duration-500">
                        </div>
                        <div class="p-6">
                            <h4 class="font-bold text-xl mb-3 text-gray-900">${ex.name}</h4>
                            <p class="text-gray-600 text-sm leading-relaxed">${ex.guide}</p>
                        </div>
                    </div>
                `;
            });
            exercisesHtml += `</div>`;
        } else {
            exercisesHtml = '<p class="text-gray-500 italic text-center">Pro tuto partii zatím nejsou cviky k dispozici.</p>';
        }

        const benefitsHtml = part.benefits ? part.benefits.map(b =>
            `<span class="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mr-2 mb-2">
                <i class="ph ph-check mr-1"></i>${b}
            </span>`
        ).join('') : '';

        detailContent.innerHTML = `
            <div class="text-center mb-12">
                <div class="inline-block p-4 rounded-full bg-brand-blue/10 text-brand-blue mb-4">
                     <i class="ph ${part.icon || 'ph-barbell'} text-4xl"></i>
                </div>
                <h2 class="text-4xl font-bold text-gray-900 mb-4">${part.name}</h2>
                <div class="max-w-2xl mx-auto">
                    <p class="text-gray-600 mb-6 text-lg">${part.description}</p>
                    <div class="flex flex-wrap justify-center gap-2">
                        ${benefitsHtml}
                    </div>
                </div>
            </div>
            
            <div class="mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-brand-orange pl-4">Doporučené cviky</h3>
                ${exercisesHtml}
            </div>
        `;

        detailView.classList.remove('hidden');
        detailView.scrollIntoView({ behavior: 'smooth' });
    }

    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;

        submitBtn.innerText = 'Odesílám...';
        submitBtn.disabled = true;

        fetch('api/contact.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                formMessage.classList.remove('hidden');
                if (data.status === 'success') {
                    formMessage.innerText = 'Děkujeme! Vaše zpráva byla odeslána.';
                    formMessage.className = 'text-center text-sm mt-4 text-green-500 font-bold';
                    contactForm.reset();
                } else {
                    formMessage.innerText = 'Chyba: ' + (data.message || 'Něco se pokazilo.');
                    formMessage.className = 'text-center text-sm mt-4 text-red-500 font-bold';
                }
            })
            .catch(error => {
                formMessage.classList.remove('hidden');
                formMessage.innerText = 'Chyba připojení. Zkuste to prosím později.';
                formMessage.className = 'text-center text-sm mt-4 text-red-500 font-bold';
            })
            .finally(() => {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
    });
});
