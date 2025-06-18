// ==UserScript==
// @name         Instagram to Imginn Redirect + Manual Downloader
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Instagram linklerini imginn'e yönlendirir ve manuel indirme butonu ekler (mobil uyumlu)
// @match        *://www.instagram.com/*
// @match        *://imginn.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;

    // 1. Instagram Login yönlendirmesi
    if (url.includes('/accounts/login') && url.includes('next=')) {
        const params = new URLSearchParams(window.location.search);
        const nextPath = params.get('next'); // örn: "/pasmurnno/"
        const cleanPath = nextPath.replace(/^\/+|\/+$/g, '');
        const imginnUrl = `https://imginn.com/${cleanPath}`;
        window.location.replace(imginnUrl);
        return;
    }

    // 2. Normal profil ya da gönderi yönlendirmesi
    const isProfileOrPost = /^https:\/\/www\.instagram\.com\/(p|reel|tv)\/|^https:\/\/www\.instagram\.com\/[^\/]+\/?$/.test(url);
    if (isProfileOrPost) {
        const cleanPath = url.replace("https://www.instagram.com/", "").replace(/\/$/, "");
        const imginnUrl = `https://imginn.com/${cleanPath}`;
        location.replace(imginnUrl); // TARİHÇEYE KAYDETMEZ
        return;
    }

    // 3. Eğer imginn sayfasıysa indirme butonunu ekle
    if (url.includes("imginn.com")) {
        const tryAddDownloadButton = () => {
            // Eğer sayfa yavaş yükleniyorsa, bekle
            const contentImage = document.querySelector('img.post-image, .post-img img');
            const contentVideo = document.querySelector('video');

            const alreadyAdded = document.getElementById('my-download-btn');
            if (alreadyAdded) return; // tekrar ekleme

            let media = contentImage || contentVideo;
            if (!media) {
                setTimeout(tryAddDownloadButton, 1000);
                return;
            }

            const btn = document.createElement('button');
            btn.id = 'my-download-btn';
            btn.innerText = '⬇️ İndir';
            btn.style.position = 'fixed';
            btn.style.bottom = '20px';
            btn.style.right = '20px';
            btn.style.padding = '10px 15px';
            btn.style.fontSize = '16px';
            btn.style.backgroundColor = '#000';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.borderRadius = '10px';
            btn.style.zIndex = '9999';

            btn.onclick = () => {
                const link = document.createElement('a');
                link.href = media.src;
                link.download = 'imginn-media';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };

            document.body.appendChild(btn);
        };

        window.addEventListener('load', tryAddDownloadButton);
    }
})();
