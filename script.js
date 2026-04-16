// ==========================================
// 1. DADOS DOS CERTIFICADOS & MODAIS
// ==========================================
const certificadosData = [
    {
        titulo: "SuperGeeks",
        instituicao: "SuperGeeks",
        ano: "2024", 
        imagem: "Img/py_para_dados_certificado.png" // Garanta que esta imagem exista ou mude o nome
    },
    {
        titulo: "Começando com o Cisco Packet Tracer",
        instituicao: "Cisco Networking Academy",
        ano: "2026", 
        imagem: "Img/certificadocisco.png"
    }
];

const modalManager = {
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Evita scroll do fundo
        }
    },
    close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
};

const renderCertificadoModal = (src, title) => {
    const imgElement = document.getElementById('img-certificado');
    const captionElement = document.getElementById('legenda-certificado');
    if (imgElement && captionElement) {
        imgElement.src = src;
        imgElement.alt = title;
        captionElement.textContent = title;
        modalManager.open('modal-certificado');
    }
};

const initCertificados = () => {
    const container = document.getElementById('certificados-grid');
    if (!container) return;

    certificadosData.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'project-card tilt-card gs-reveal'; 
        
        card.onclick = () => renderCertificadoModal(cert.imagem, cert.titulo);

        card.innerHTML = `
            <div class="card-inner">
                <h4>${cert.titulo}</h4>
                <p>${cert.instituicao} • ${cert.ano}</p>
                <span class="view-more">Ver Certificado ➔</span>
            </div>
        `;
        container.appendChild(card);
    });
};

const setupModalListeners = () => {
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    });
};

// ==========================================
// 2. CURSOR CUSTOMIZADO
// ==========================================
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, posX = 0, posY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
});

gsap.ticker.add(() => {
    posX += (mouseX - posX) * 0.15;
    posY += (mouseY - posY) * 0.15;
    gsap.set(follower, { left: posX, top: posY });
});

// Aumenta o cursor ao passar em áreas interativas
const setupCursorHover = () => {
    document.querySelectorAll('a, button, .tilt-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(follower, { scale: 1.5, backgroundColor: 'rgba(56, 189, 248, 0.2)', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(follower, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
        });
    });
};

// ==========================================
// 3. ANIMAÇÕES DE ROLAGEM COM GSAP E TILT
// ==========================================
gsap.registerPlugin(ScrollTrigger);

const initAnimations = () => {
    gsap.from(".hero-content > *", {
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2
    });

    gsap.utils.toArray('.gs-reveal').forEach(function(elem) {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50, opacity: 0, duration: 1, ease: "power3.out"
        });
    });
};

const initTiltCards = () => {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
};

// ==========================================
// 4. BACKGROUND 3D (THREE.JS) & TEMA
// ==========================================
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();

// Checa estado inicial do tema para as cores do 3D
const savedTheme = localStorage.getItem('theme');
const initialIsLight = savedTheme === 'light';

scene.fog = new THREE.FogExp2(initialIsLight ? 0xf1f5f9 : 0x0a0a0a, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.IcosahedronGeometry(1, 0); 
const material = new THREE.MeshBasicMaterial({ 
    color: initialIsLight ? 0x0284c7 : 0x38bdf8, 
    wireframe: true,
    transparent: true,
    opacity: 0.15
});

const group = new THREE.Group();
scene.add(group);

for(let i = 0; i < 100; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    const scale = Math.random() * 0.5 + 0.1;
    mesh.scale.set(scale, scale, scale);
    group.add(mesh);
}

camera.position.z = 10;

// Interação Parallax
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    targetX = (event.clientX - windowHalfX) * 0.001;
    targetY = (event.clientY - windowHalfY) * 0.001;
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.001;
    group.rotation.x += 0.0005;

    // Movimento do mouse
    group.rotation.y += 0.05 * (targetX - group.rotation.y);
    group.rotation.x += 0.05 * (targetY - group.rotation.x);

    group.children.forEach(mesh => {
        mesh.rotation.x += 0.002;
        mesh.rotation.y += 0.002;
    });

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Lógica de Alternância de Tema
const initDarkMode = () => {
    const btn = document.getElementById('dark-mode-toggle');
    if (!btn) return;

    if (initialIsLight) {
        document.body.classList.add('light-theme');
    }

    btn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Suaviza a mudança de cor no Three.js
        gsap.to(scene.fog.color, {
            r: new THREE.Color(isLight ? 0xf1f5f9 : 0x0a0a0a).r,
            g: new THREE.Color(isLight ? 0xf1f5f9 : 0x0a0a0a).g,
            b: new THREE.Color(isLight ? 0xf1f5f9 : 0x0a0a0a).b,
            duration: 0.5
        });
        gsap.to(material.color, {
            r: new THREE.Color(isLight ? 0x0284c7 : 0x38bdf8).r,
            g: new THREE.Color(isLight ? 0x0284c7 : 0x38bdf8).g,
            b: new THREE.Color(isLight ? 0x0284c7 : 0x38bdf8).b,
            duration: 0.5
        });
    });
};

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initCertificados();      // Cria as tags de certificado
    setupModalListeners();   // Habilita clicar fora e Esc para modais
    initAnimations();        // Roda o GSAP ScrollTrigger
    initTiltCards();         // Adiciona efeito 3D nos cards
    initDarkMode();          // Adiciona lógica do botão de tema
    setTimeout(setupCursorHover, 500); // Aguarda criação do DOM para o cursor
});